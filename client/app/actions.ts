"use server";

interface TodoState {
  taskList: string[];
  error: string | null;
}

export async function addTodo(prevState: TodoState, data: FormData): Promise<TodoState> {
    const task: string = data.get("task")?.toString() || "";
    
    if (task.trim() === "") {
        return {
            taskList: prevState.taskList,
            error: "Task cannot be empty"
        };
    }

    const taskList: string[] = [...prevState.taskList, task];

    await fetch("http://localhost:3001/api/todos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskContent: task }),
    });

    return {
        taskList: taskList,
        error: null
    };
}