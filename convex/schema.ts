import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    intitalContent: v.optional(v.string()),
    ownerId: v.string(),
    roomId: v.optional(v.string()),
    organizationId: v.optional(v.string()),
  })
    .index("by_owner_id", ["ownerId"])
    .index("by_organization_id", ["organizationId"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["ownerId", "organizationId"],
    }),

  // Kanban Board — one board per document
  kanbanBoards: defineTable({
    title: v.string(),
    documentId: v.id("documents"),
    ownerId: v.string(),
    organizationId: v.optional(v.string()),
  }).index("by_document_id", ["documentId"]),

  // Kanban Columns — ordered columns within a board
  kanbanColumns: defineTable({
    title: v.string(),
    boardId: v.id("kanbanBoards"),
    type: v.string(), // "todo" | "in_progress" | "review" | "done"
    order: v.number(),
  }).index("by_board_id", ["boardId"]),

  // Kanban Tasks — tasks within columns
  kanbanTasks: defineTable({
    content: v.string(),
    columnId: v.id("kanbanColumns"),
    boardId: v.id("kanbanBoards"),
    position: v.number(),
    ownerId: v.string(),
  })
    .index("by_column_id", ["columnId"])
    .index("by_board_id", ["boardId"]),
});