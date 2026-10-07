"use client";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface KanbanTaskCardProps {
  task: Doc<"kanbanTasks">;
  isDragOverlay?: boolean;
}

export const KanbanTaskCard = ({ task, isDragOverlay }: KanbanTaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(task.content);

  const updateTask = useMutation(api.kanban.updateTask);
  const deleteTask = useMutation(api.kanban.deleteTask);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: {
      type: "task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = async () => {
    if (!editContent.trim()) return;
    try {
      await updateTask({ taskId: task._id, content: editContent.trim() });
      setIsEditing(false);
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask({ taskId: task._id });
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setEditContent(task.content);
      setIsEditing(false);
    }
  };

  if (isDragOverlay) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-xl p-3 w-[256px] opacity-90 rotate-2">
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{task.content}</p>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-150 ${
        isDragging ? "opacity-40 shadow-none" : ""
      }`}
    >
      {isEditing ? (
        <div className="p-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full text-sm text-gray-700 border border-gray-200 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            rows={3}
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => {
                setEditContent(task.content);
                setIsEditing(false);
              }}
              className="text-xs px-3 py-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="text-xs px-3 py-1.5 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors font-medium"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 flex items-start gap-2">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            className="mt-0.5 p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-100 cursor-grab active:cursor-grabbing transition-opacity"
          >
            <GripVertical className="size-3.5 text-gray-400" />
          </button>

          {/* Content */}
          <p className="flex-1 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {task.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 rounded-md hover:bg-blue-50 transition-colors"
            >
              <Pencil className="size-3.5 text-blue-500" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 rounded-md hover:bg-red-50 transition-colors"
            >
              <Trash2 className="size-3.5 text-red-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
