"use client";

import { addTodo } from "./actions";
import { useActionState, useEffect, useState } from "react";

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
        className="border border-gray-300 px-8 py-1.5 rounded-sm [field-sizing:content] max-w-[500px]"
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
}

function TaskList({ todos }: { todos: Todo[] }) {
  const [taskList, setTaskList] = useState(todos);
  const handleDelete = async (id: number) => {
    await deleteTodo(id);
    setTaskList(...)
  };
  
  return (
    <ul className="mt-4">
      {taskList.map((todo) => (
        <li
          className="flex items-center gap-1.5 border border-gray-300 p-3 rounded-lg mb-1 bg-gray-100 w-100"
          key={todo.id}
        >
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-500 cursor-pointer"
          />
          <div className="break-all">
            <p>{todo.content}</p>
          </div>
          <div>
            {/* <button onClick={() => {handleEdit(todo.id)}}>編集</button> */}
            <button
              onClick={() => {
                handleDelete(todo.id);
              }}
              className="border border-gray-300 px-2 py-1.5 rounded-sm active:scale-95"
            >
              削除
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function TodoList() {
  const [state, formAction] = useActionState(addTodo, {
    todos: [],
    error: null,
  });
  const [initialList, setInitialList] = useState<Todo[]>([]);
  const currentTaskList = state.todos.length > 0 ? state.todos : initialList;

  useEffect(() => {
    fetch("http://localhost:3001/api/todos")
      .then((res) => res.json())
      .then((data: Todo[]) => {
        setInitialList(data);
      })
      .catch((err) => {
        console.error("初期データの読み込みに失敗しました", err);
        alert("初期データの読み込みに失敗しました");
      });
  }, []); // ページを開いた時の「最初の1回だけ」実行させるなら、[]と設定します

  useEffect(() => {
    if (state.error) {
      alert(state.error);
    }
  }, [state.error]);

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <Title />
      <TodoInput formAction={formAction} />
      <TaskList todos={currentTaskList} />
    </div>
  );
}
