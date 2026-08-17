import { describe, it, expect } from "vitest";
import { addTodo } from "./actions";

interface Todo {
  id: number;
  content: string;
}

// describe(標題字串, 函式)：分組容器，裡面可以放很多個 it(...)，把「同一功能的相關測試」歸類在一起
// 標題字串: 這組測試(或這個測試案例)的名稱
// 函式: 測試邏輯
describe("addTodo", () => {
  // it(標題字串, 函式)：一個具體、單一的測試案例，裡面才是真正執行 Arrange–Act–Assert 的地方
  it("空白輸入時應該回傳錯誤訊息", async () => {
    // Arrange: 準備輸入資料
    const prevTodo: Todo[] = [];

    const formData = new FormData();
    formData.append("task", "");

    // Act: 執行我們要測試的函式
    const result = await addTodo(prevTodo, formData);

    // Assert: 驗證結果符合預期
    expect(result.error).toBe("Task cannot be empty.");
  });
});
