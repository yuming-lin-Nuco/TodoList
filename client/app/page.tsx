"use client";

import { useEffect, useOptimistic, useState, startTransition } from "react";
import { addTodo, deleteTodo, editTodo } from "./actions";

function Title() {
  return <h1 className="text-4xl font-bold mt-4 p-4 ">Todo List</h1>;
}

function TodoInput({
  formAction,
}: {
  formAction: (payload: FormData) => void;
}) {
  return (
    <form className="flex items-center gap-2" action={formAction}>
      <input
        className="border border-gray-300 px-8 py-1.5 rounded-sm field-sizing:content max-w-125"
        type="text"
        placeholder="タスクを入力する"
        name="task"
      />
      <button
        className="border border-gray-300 px-2 py-1.5 rounded-sm active:scale-95"
        type="submit"
      >
        送信
      </button>
    </form>
  );
}

interface Todo {
  id: number;
  content: string;
  isDone: boolean;
  dueTime: Date | null;
}

function TaskList({
  todos,
  onDelete,
  editingId,
  onStartEdit,
  onSaveEdit,
}: {
  todos: Todo[];
  onDelete: (id: number, content: string) => void;
  editingId: number | null;
  onStartEdit: (id: number) => void;
  onSaveEdit: (
    id: number,
    newContent: string,
    isDone: boolean,
    dueTime: Date | null,
  ) => void;
}) {
  return (
    <ul className="mt-4">
      {todos.map((todo) => {
        const handleSave = (
          event:
            | React.FocusEvent<HTMLInputElement>
            | React.KeyboardEvent<HTMLInputElement>,
        ) => {
          onSaveEdit(
            todo.id,
            event.currentTarget.value,
            todo.isDone,
            todo.dueTime,
          );
        };
        const handleToggleIsDone = (
          event: React.ChangeEvent<HTMLInputElement>,
        ) => {
          onSaveEdit(
            todo.id,
            todo.content,
            event.currentTarget.checked,
            todo.dueTime,
          );
        };

        return (
          <li
            className="flex items-center gap-1.5 border border-gray-300 p-3 rounded-lg mb-1 bg-gray-100 w-100"
            key={todo.id}
          >
            <input
              type="checkbox"
              checked={todo.isDone}
              onChange={handleToggleIsDone}
              className="form-checkbox h-5 w-5 text-blue-500 cursor-pointer"
            />
            <div className="break-all flex-1">
              {editingId === todo.id ? (
                <input
                  defaultValue={todo.content}
                  autoFocus
                  className="border border-gray-300 px-2 py-1 rounded-sm"
                  onBlur={handleSave}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSave(event);
                    }
                  }}
                />
              ) : (
                <p
                  onClick={() => {
                    onStartEdit(todo.id);
                  }}
                  className="cursor-pointer"
                >
                  {todo.content}
                </p>
              )}
            </div>
            <div>
              <button
                onClick={() => onDelete(todo.id, todo.content)}
                className="border border-gray-300 px-2 py-1.5 rounded-sm active:scale-95"
              >
                削除
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

type TodoAction =
  | { type: "add"; todo: Todo }
  | { type: "delete"; id: number }
  | {
      type: "edit";
      editId: number;
      newContent: string;
      isDone: boolean;
      dueTime: Date | null;
    };

function todosReducer(currentTodos: Todo[], action: TodoAction) {
  switch (action.type) {
    case "add":
      return [...currentTodos, action.todo];
    case "delete":
      return currentTodos.filter((todo) => todo.id !== action.id);
    case "edit":
      return currentTodos.map((todo) =>
        todo.id === action.editId
          ? {
              ...todo,
              content: action.newContent,
              isDone: action.isDone,
              dueTime: action.dueTime,
            }
          : todo,
      );
  }
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [optimisticTodos, updateOptimisticTodos] = useOptimistic(
    todos,
    todosReducer,
  );

  const handleAdd = async (formData: FormData) => {
    const taskContent = formData.get("task")?.toString() ?? "";

    // サーバーがまだ本物の ID を発行していないため、楽観的な更新に使うために、一時的な仮の ID を作る
    // Date.now() は「1970年からの経過ミリ秒数」を返す大きな正の数値なので、
    // マイナスをつけることで、DB の本物の ID(正の整数)と絶対に被らないようにする
    const tempTodo: Todo = {
      id: -Date.now(),
      content: taskContent,
      isDone: false,
      dueTime: null,
    };

    updateOptimisticTodos({ type: "add", todo: tempTodo });

    const result = await addTodo(todos, formData);

    if (result.error) {
      setError(result.error);
      return;
    }

    setError(null);
    setTodos(result.todos);
  };

  const handleDelete = (id: number, content: string) => {
    const isConfirmed = confirm(`「${content}」を削除しますか？`);

    if (isConfirmed) {
      startTransition(async () => {
        updateOptimisticTodos({ type: "delete", id });
        const result = await deleteTodo(todos, id);
        setTodos(result.todos);
      });
    }
  };

  const handleSaveEdit = (
    id: number,
    newContent: string,
    isDone: boolean,
    dueTime: Date | null,
  ) => {
    startTransition(async () => {
      updateOptimisticTodos({
        type: "edit",
        editId: id,
        newContent,
        isDone,
        dueTime,
      });
      const result = await editTodo(todos, id, newContent, isDone, dueTime);
      setTodos(result.todos);
      setEditingId(null);
    });
  };

  useEffect(() => {
    fetch("http://localhost:3001/api/todos")
      .then((res) => res.json())
      .then((data: Todo[]) => {
        setTodos(data);
      })
      .catch((err) => {
        console.error("初期データの読み込みに失敗しました", err);
        alert("初期データの読み込みに失敗しました");
      });
  }, []); // ページを開いた時の「最初の1回だけ」実行させるなら、[]と設定します

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center p-4">
      <Title />
      <TodoInput formAction={handleAdd} />
      <TaskList
        todos={optimisticTodos}
        onDelete={handleDelete}
        editingId={editingId}
        onStartEdit={setEditingId}
        onSaveEdit={handleSaveEdit}
      />
    </main>
  );
}
