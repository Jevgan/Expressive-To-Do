-- CreateTable
CREATE TABLE "Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT,
    "dueDate" DATETIME,
    "isCompleted" BOOLEAN NOT NULL
);
