import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─── Default columns created with every new board ───
const DEFAULT_COLUMNS = [
  { title: "Todo", type: "todo", order: 0 },
  { title: "In Progress", type: "in_progress", order: 1 },
  { title: "Review", type: "review", order: 2 },
  { title: "Done", type: "done", order: 3 },
];

// ─── Get or create a board for a document ───
export const getOrCreateBoard = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Unauthorized");

    // Check if board already exists for this document
    const existing = await ctx.db
      .query("kanbanBoards")
      .withIndex("by_document_id", (q) => q.eq("documentId", documentId))
      .first();

    if (existing) return existing._id;

    // Get the document to read its title
    const doc = await ctx.db.get(documentId);
    if (!doc) throw new Error("Document not found");

    const organizationId = (user.organization_id ?? undefined) as
      | string
      | undefined;

    // Create board
    const boardId = await ctx.db.insert("kanbanBoards", {
      title: `${doc.title} Kanban Board`,
      documentId,
      ownerId: user.subject,
      organizationId,
    });

    // Create default columns
    for (const col of DEFAULT_COLUMNS) {
      await ctx.db.insert("kanbanColumns", {
        title: col.title,
        boardId,
        type: col.type,
        order: col.order,
      });
    }

    return boardId;
  },
});

// ─── Get board by document ID ───
export const getBoard = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return null;

    return await ctx.db
      .query("kanbanBoards")
      .withIndex("by_document_id", (q) => q.eq("documentId", documentId))
      .first();
  },
});

// ─── Get columns for a board ───
export const getColumns = query({
  args: { boardId: v.id("kanbanBoards") },
  handler: async (ctx, { boardId }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return [];

    const columns = await ctx.db
      .query("kanbanColumns")
      .withIndex("by_board_id", (q) => q.eq("boardId", boardId))
      .collect();

    return columns.sort((a, b) => a.order - b.order);
  },
});

// ─── Get all tasks for a board ───
export const getTasks = query({
  args: { boardId: v.id("kanbanBoards") },
  handler: async (ctx, { boardId }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return [];

    const tasks = await ctx.db
      .query("kanbanTasks")
      .withIndex("by_board_id", (q) => q.eq("boardId", boardId))
      .collect();

    return tasks.sort((a, b) => a.position - b.position);
  },
});

// ─── Create a new task ───
export const createTask = mutation({
  args: {
    content: v.string(),
    columnId: v.id("kanbanColumns"),
    boardId: v.id("kanbanBoards"),
  },
  handler: async (ctx, { content, columnId, boardId }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Unauthorized");

    // Get current tasks in this column to determine position
    const existingTasks = await ctx.db
      .query("kanbanTasks")
      .withIndex("by_column_id", (q) => q.eq("columnId", columnId))
      .collect();

    const maxPosition =
      existingTasks.length > 0
        ? Math.max(...existingTasks.map((t) => t.position))
        : -1;

    return await ctx.db.insert("kanbanTasks", {
      content,
      columnId,
      boardId,
      position: maxPosition + 1,
      ownerId: user.subject,
    });
  },
});

// ─── Update task content ───
export const updateTask = mutation({
  args: {
    taskId: v.id("kanbanTasks"),
    content: v.string(),
  },
  handler: async (ctx, { taskId, content }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Unauthorized");

    const task = await ctx.db.get(taskId);
    if (!task) throw new Error("Task not found");

    return await ctx.db.patch(taskId, { content });
  },
});

// ─── Move task to a different column or reorder ───
export const moveTask = mutation({
  args: {
    taskId: v.id("kanbanTasks"),
    newColumnId: v.id("kanbanColumns"),
    newPosition: v.number(),
  },
  handler: async (ctx, { taskId, newColumnId, newPosition }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Unauthorized");

    const task = await ctx.db.get(taskId);
    if (!task) throw new Error("Task not found");

    return await ctx.db.patch(taskId, {
      columnId: newColumnId,
      position: newPosition,
    });
  },
});

// ─── Delete a task ───
export const deleteTask = mutation({
  args: { taskId: v.id("kanbanTasks") },
  handler: async (ctx, { taskId }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Unauthorized");

    const task = await ctx.db.get(taskId);
    if (!task) throw new Error("Task not found");

    return await ctx.db.delete(taskId);
  },
});
