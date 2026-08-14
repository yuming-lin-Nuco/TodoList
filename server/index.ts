import express from "express";
import cors from "cors"; // CORS（Cross-Origin Resource Sharing）を有効にするため //オリジン間リソース共有 //跨來源資源共享
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";

const app = express();
app.use(express.json(), cors());

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}
const adapter = new PrismaBetterSqlite3({
  url: databaseUrl,
});
const prisma = new PrismaClient({ adapter });

async function getTodoListFromDB() {
  try {
    const todoListDataInDB = await prisma.todo.findMany();
    const todos = todoListDataInDB.map((todo) => ({
      id: todo.id,
      content: todo.content,
    }));
    return todos;
  } catch (error: unknown) {
    console.error("エラー：データベースを読み取れませんでした", error);
    if (error instanceof Error) {
      throw new Error(
        "データベースの読み込み中にエラーが発生しました" + error.message,
        { cause: error },
      );
    }

    throw new Error("データベースの読み込み中にエラーが発生しました", {
      cause: error,
    });
  }
}

async function saveTodoToDB(newTask: string) {
  try {
    await prisma.todo.create({
      data: {
        content: newTask,
      },
    });
  } catch (error: unknown) {
    console.error("エラー：デーラベースに書き込めませんでした", error);
    if (error instanceof Error) {
      throw new Error(
        "データベースに書き込み中にエラーが発生しました" + error.message,
        { cause: error },
      );
    }
  }
}

async function delTodoFromDB(todoID: number) {
  try {
    await prisma.todo.delete({
      where: {
        id: todoID,
      },
    });
  } catch (error: unknown) {
    console.error("エラー：データベースのデータ削除はできませんでした", error);
    if (error instanceof Error) {
      throw new Error(
        "データベースのデータ削除にエラーが発生しました" + error.message,
        { cause: error },
      );
    }
  }
}

async function updateTodoInDB(todoID: number, newTaskContent: string) {
  try {
    await prisma.todo.update({
      where: {
        id: todoID,
      },
      data: {
        content: newTaskContent,
      },
    });
  } catch (error: unknown) {
    console.error("エラー：データベースのデータ編集はできませんでした", error);
    if (error instanceof Error) {
      throw new Error(
        "データベースのデータ編集にエラーが発生しました" + error.message,
        { cause: error },
      );
    }
  }
}

app.get("/", (req, res) => {
  res.send("Thanks for using the Todo List!");
});

// GET API：データベースからタスクリストを取得する
app.get("/api/todos", async (req, res) => {
  const todoList = await getTodoListFromDB();
  res.json(todoList);
});

// POST API：タスクを追加し、データベースに保存する
app.post("/api/todos", async (req, res) => {
  const { taskContent } = req.body;
  if (
    !taskContent ||
    typeof taskContent !== "string" ||
    taskContent.trim() === ""
  ) {
    return res.status(400).json({ error: "Invalid taskContent content" });
  }
  await saveTodoToDB(taskContent);
  const currentTodoList = await getTodoListFromDB();
  res.status(201).json(currentTodoList);
});

// DELETE API：データベースからタスクリストを取得する
app.delete("/api/todos/:id", async (req, res) => {
  console.log("===== DELETE API START =====");
  console.log("DELETE ID:", req.params.id);
  const todoId = Number(req.params.id); //req.params の戻り値は string なので数値に変換します
  await delTodoFromDB(todoId);
  const currentTodoList = await getTodoListFromDB();
  res.status(200).json(currentTodoList);
});

// PATCH API：タスクを編集し、データベースに保存する
app.patch("/api/todos/:id", async (req, res) => {
  const todoId = Number(req.params.id); //req.params の戻り値は string なので数値に変換します
  if (Number.isNaN(todoId) === true) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  const { taskContent } = req.body;

  if (
    !taskContent ||
    typeof taskContent !== "string" ||
    taskContent.trim() === ""
  ) {
    return res.status(400).json({ error: "Invalid taskContent content" });
  }
  await updateTodoInDB(todoId, taskContent);
  const currentTodoList = await getTodoListFromDB();
  res.status(200).json(currentTodoList);
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
