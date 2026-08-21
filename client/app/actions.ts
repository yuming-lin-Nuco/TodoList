"use server";

interface Todo {
  id: number;
  content: string;
  isDone: boolean;
  dueTime: Date | null;
}
interface TodoState {
  todos: Todo[];
  error: string | null;
}

export async function addTodo(
  prevTodos: Todo[],
  data: FormData,
): Promise<TodoState> {
  const newTask: string = data.get("task")?.toString() || "";
  const taskDueTimeString = data.get("dueTime")?.toString();
  const taskDueTime = taskDueTimeString ? new Date(taskDueTimeString) : null;

  if (newTask.trim() === "") {
    return {
      todos: prevTodos,
      error: "Task content cannot be empty.",
    };
  }

  try {
    const response = await fetch("http://localhost:3001/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskContent: newTask, dueTime: taskDueTime }),
    });

    if (!response.ok) {
      return {
        todos: prevTodos,
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
      todos: prevTodos,
      error: "An error occurred while communicating with the server.",
    };
  }
}

export async function deleteTodo(
  prevTodos: Todo[],
  todoId: number,
): Promise<TodoState> {
  try {
    const response = await fetch(`http://localhost:3001/api/todos/${todoId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      return {
        todos: prevTodos,
        error: "Failed to delete todo on the server.",
      };
    }
    const updatedTaskList: Todo[] = await response.json();
    return {
      todos: updatedTaskList,
      error: null,
    };
  } catch {
    return {
      todos: prevTodos,
      error: "An error occurred while communicating with the server.",
    };
  }
}

export async function editTodo(
  prevTodos: Todo[],
  todoId: number,
  newContent: string,
  isDone: boolean,
  dueTime: Date | null,
): Promise<TodoState> {
  try {
    const response = await fetch(`http://localhost:3001/api/todos/${todoId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskContent: newContent,
        isDone: isDone,
        dueTime: dueTime,
      }),
    });
    if (!response.ok) {
      return {
        todos: prevTodos,
        error: "Failed to edit todo on the server.",
      };
    }
    const updatedTaskList: Todo[] = await response.json();
    return {
      todos: updatedTaskList,
      error: null,
    };
  } catch {
    return {
      todos: prevTodos,
      error: "An error occurred while communicating with the server.",
    };
  }
}
