"use client";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanTaskCard } from "./kanban-task-card";
import { KanbanAddTask } from "./kanban-add-task";
import { Plus } from "lucide-react";
import { useState } from "react";

interface KanbanColumnProps {
  column: Doc<"kanbanColumns">;
  tasks: Doc<"kanbanTasks">[];
  boardId: Id<"kanbanBoards">;
}

const COLUMN_COLORS: Record<string, { bg: string; border: string; badge: string; dot: string }> = {
  todo: {
    bg: "bg-slate-50",
    border: "border-slate-200",
    badge: "bg-slate-100 text-slate-700",
    dot: "bg-slate-400",
  },
  in_progress: {
    bg: "bg-blue-50/50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
  },
  review: {
    bg: "bg-amber-50/50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
  },
  done: {
    bg: "bg-emerald-50/50",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },
};

export const KanbanColumn = ({ column, tasks, boardId }: KanbanColumnProps) => {
  const [isAdding, setIsAdding] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: column._id,
  });

  const colors = COLUMN_COLORS[column.type] ?? COLUMN_COLORS.todo;

  return (
    <div
      className={`flex flex-col w-[280px] min-w-[280px] rounded-xl border ${colors.border} ${colors.bg} transition-all duration-200 ${
        isOver ? "ring-2 ring-blue-400 ring-offset-2 scale-[1.01]" : ""
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100/80">
        <div className="flex items-center gap-2">
          <div className={`size-2 rounded-full ${colors.dot}`} />
          <h3 className="text-sm font-semibold text-gray-800">{column.title}</h3>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.badge}`}
          >
            {tasks.length}
          </span>
        </div>

        {column.type === "todo" && (
          <button
            onClick={() => setIsAdding(true)}
            className="p-1 rounded-md hover:bg-white/80 transition-colors group"
          >
            <Plus className="size-4 text-gray-400 group-hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Tasks List */}
      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[200px] max-h-[60vh]"
      >
        <SortableContext
          items={tasks.map((t) => t._id)}
          strategy={verticalListSortingStrategy}
        >
          {/* Add task form at the top */}
          {isAdding && (
            <KanbanAddTask
              columnId={column._id}
              boardId={boardId}
              onClose={() => setIsAdding(false)}
            />
          )}

          {tasks.map((task) => (
            <KanbanTaskCard key={task._id} task={task} />
          ))}

          {tasks.length === 0 && !isAdding && (
            <div className="flex items-center justify-center h-20 text-xs text-gray-400">
              No tasks yet
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};
