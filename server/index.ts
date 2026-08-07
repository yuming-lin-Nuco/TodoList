import express from "express";

const app = express();
app.use(express.json());
const todos: string[] = [];

app.listen( 3001, () => {
  console.log("Server is running on port 3001");
});

app.get("/", (req, res) => {
  res.send("Thanks for using the Todo List!");
});

app.get("/api/todos", (req, res) => {
  res.json(todos);
});

app.post("/api/todos", (req, res) => {
    const { taskContent } = req.body;
    if (!taskContent || typeof taskContent !== "string" || taskContent.trim() === "") {
        return res.status(400).json({ error: "Invalid taskContent content" });
    }
    todos.push(taskContent);
    res.status(201).json({ message: "Todo added" });
}); 