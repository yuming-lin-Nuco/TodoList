/*
  Warnings:

  - You are about to drop the column `dueDate` on the `Todo` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Todo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDone" BOOLEAN NOT NULL DEFAULT false,
    "dueTime" DATETIME
);
INSERT INTO "new_Todo" ("content", "createdAt", "id", "isDone") SELECT "content", "createdAt", "id", "isDone" FROM "Todo";
DROP TABLE "Todo";
ALTER TABLE "new_Todo" RENAME TO "Todo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
