"use server";

interface Todo {
  id: number;
  content: string;
}
interface TodoState {
  todos: Todo[];
  error: string | null;
}

export async function addTodo(
  prevState: TodoState,
  data: FormData,
): Promise<TodoState> {
  const newTask: string = data.get("task")?.toString() || "";

  if (newTask.trim() === "") {
    return {
      todos: prevState.todos,
      error: "Task cannot be empty.",
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
        todos: prevState.todos,
        error: "Failed to add todo to the server.",
      };
    }
    const updatedTaskList: Todo[] = await response.json();
    return {
      todos: updatedTaskList,
      error: null,
    };
  } catch {
    return {
      todos: prevState.todos,
      error: "An error occurred while communicating with the server.",
    };
  }
}

export async function deleteTodo(todoId: number): Promise<TodoState> {
  try {
    const response = await fetch(`http://localhost:3001/api/todos/${todoId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete todo on the server.");
    }
    const updatedTaskList: Todo[] = await response.json();
    return {
      todos: updatedTaskList,
      error: null,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(
        "An error occurred while communicating with the server." +
          error.message,
        {
          cause: error,
        },
      );
    }

    throw new Error("An error occurred while communicating with the server.");
  }
}
