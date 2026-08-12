import express from "express";
// import fs from "fs/promises";
// import path from "path";
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

// const dataFilePath = path.join(process.cwd(), "todoList.json");

// async function getTodoListFromFile(): Promise<string[]> {
//   try {
//     const todoListData = await fs.readFile(dataFilePath, "utf-8");
//     return JSON.parse(todoListData);
//   } catch (error: any) {
//     if (error.code === "ENOENT") {
//       // ENOENT はファイルが存在しない場合のエラーコード
//       return []; // プロジェクトが初めて実行される場合、空の配列を返す
//     }
//     console.error("エラー：todoList.jsonを読み取れませんでした", error);
//     throw new Error("データの読み込み中にエラーが発生しました" + error.message);
//   }
// }

async function getTodoListFromDB() {
  try {
    const todoListDataInDB = await prisma.todo.findMany();
    const todoList: string[] = todoListDataInDB.map((todo) => todo.content);
    return todoList;

  } catch (error: any) {
    console.error("エラー：データベースを読み取れませんでした", error);
    throw new Error(
      "データベースの読み込み中にエラーが発生しました" + error.message,
    );
  }
}

// async function saveTodoListToFile(taskList: string[]): Promise<void> {
//   try {
//     await fs.writeFile(
//       dataFilePath,
//       JSON.stringify(taskList, null, 2),
//       "utf-8",
//     );

//     // JSON.stringify(データ, 置換関数, インデント)
//     // - 第2引数 (null): フィルター（置換関数）は使用せず、すべてのデータをそのまま出力する
//     // - 第3引数 (2): インデント（字下げ）のスペース数を2個にし、ファイルを見やすく整形する
//   } catch (error: any) {
//     console.error("エラー：todoList.jsonを書き込めませんでした", error);
//     throw new Error("データの書き込み中にエラーが発生しました" + error.message);
//   }
// }

async function saveTodoListToDB(newTask: string) {
  try {
    await prisma.todo.create({
      data: {
        content: newTask,
      },
    });
  } catch (error: any) {
    console.error("エラー：デーラベーすに書き込めませんでした", error);
    throw new Error(
      "データベースに書き込み中にエラーが発生しました" + error.message,
    );
  }
}

app.get("/", (req, res) => {
  res.send("Thanks for using the Todo List!");
});

// GET API：ファイルからタスクリストを取得する
app.get("/api/todos", async (req, res) => {
  const todoList = await getTodoListFromDB();
  res.json(todoList);
});

// POST API：タスクを追加し、ファイルに保存する
app.post("/api/todos", async (req, res) => {
  const { taskContent } = req.body;
  if (
    !taskContent ||
    typeof taskContent !== "string" ||
    taskContent.trim() === ""
  ) {
    return res.status(400).json({ error: "Invalid taskContent content" });
  }
  await saveTodoListToDB(taskContent);
  const currentTodoList = await getTodoListFromDB();
  res.status(201).json(currentTodoList);
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
