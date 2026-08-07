"use server";

export async function addTodo(prevTaskList: string[], data: FormData) {
    const task: string = data.get("task")?.toString() || "";
    const taskList: string[] = [...prevTaskList, task];
    return taskList;
}