import { addTodo } from "./actions";

function Title () {
  return (
    <h1 className="text-4xl font-bold mt-4 p-4 ">Todo List</h1>
  )
};

function TodoForm(){
  return (
      <form className="flex items-center gap-2" action={addTodo}>
      <input className="border border-gray-300 px-20 py-1.5" type="text" placeholder="タスクを入力する" />
      <button className="border border-gray-300 px-1.5 py-1" type="submit">送信</button>
      </form>
  )
}

function TaskList() {
  return (
    <ul className="mt-4">
  )
}

export default function TodoList() {
  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <Title />
      <TodoForm />
      <TaskList />
    </div>
  );
}