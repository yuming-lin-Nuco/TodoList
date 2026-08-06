"use client";

import { addTodo } from "./actions";
import { useFormState } from "react-dom";

function Title() {
  return (
    <h1 className="text-4xl font-bold mt-4 p-4 ">Todo List</h1>
  )
};

function TodoInput({ formAction }: { formAction: (payload: FormData) => void }) {
  return (
    <form className="flex items-center gap-2" action={formAction}>
      <input className="border border-gray-300 px-20 py-1.5" type="text" placeholder="タスクを入力する" name="task" />
      <button className="border border-gray-300 px-1.5 py-1" type="submit">送信</button>
    </form>
  )
}

function TaskList({ taskList }: { taskList: string[] }) {
  return (
    <ul className="mt-4">
      {taskList.map((task, index) => (
        <li key={index}>{task}</li>
      ))}
    </ul>
  )
}

export default function TodoList() {
  const [taskList, formAction] = useFormState(addTodo, []);
  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <Title />
      <TodoInput formAction={formAction} />
      <TaskList taskList={taskList} />
    </div>
  );
}