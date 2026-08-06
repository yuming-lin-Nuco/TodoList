export async function addTodo(data: FormData) {
    "use server";
    const task = data.get("task")?.toString();
}