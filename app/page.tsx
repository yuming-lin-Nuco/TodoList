import { addTodo } from "./actions";

export default function todoList() {
  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold mt-4 p-4 ">Todo List</h1>
      <form className="flex items-center gap-2" action={addTodo}>
        <input className="border border-gray-300 px-20 py-1.5" type="text" placeholder="タスクを入力する" />
        <button className="border px-1.5 py-1" type="submit">送信</button>
      </form>
    </div>
  );
}