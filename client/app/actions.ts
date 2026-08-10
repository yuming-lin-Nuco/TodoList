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

    try {
        const response = await fetch("http://localhost:3001/api/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ taskContent: task }),
        });

        if (!response.ok) {
            return {
                taskList: prevState.taskList,
                error: "Failed to add todo to server"
            };
        }

        return {
            taskList: taskList,
            error: null
        };
        
    } catch (error) {
        return {
            taskList: prevState.taskList,
            error: "An error occurred to the server"
        };
    }
}