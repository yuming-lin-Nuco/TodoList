"use server";

interface TodoState {
  taskList: string[];
  error: string | null;
}

export async function addTodo(prevState: TodoState, data: FormData): Promise<TodoState> {
    const newTask: string = data.get("task")?.toString() || "";
    
    if (newTask.trim() === "") {
        return {
            taskList: prevState.taskList,
            error: "Task cannot be empty"
        };
    }

    try {
        const response = await fetch("http://localhost:3001/api/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ taskContent: newTask }),
        });

        if (!response.ok) {
            return {
                taskList: prevState.taskList,
                error: "Failed to add todo to server"
            };
        }
        const updatedTaskList: string[] = await response.json();
        return {
            taskList: updatedTaskList,
            error: null
        };

    } catch {
        return {
            taskList: prevState.taskList,
            error: "An error occurred to the server"
        };
    }
}   