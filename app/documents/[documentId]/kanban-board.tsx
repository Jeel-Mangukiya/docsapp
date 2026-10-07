"use client";

import { useState, useEffect, useCallback, Component, ReactNode } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEditorStore } from "@/store/use-editor-store";
import { KanbanColumn } from "./kanban-column";
import { X, AlertTriangle, RefreshCw } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { KanbanTaskCard } from "./kanban-task-card";

// ─── Error Boundary ───
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class KanbanErrorBoundary extends Component<
  { children: ReactNode; onClose: () => void },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; onClose: () => void }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-8 print:hidden">
          <div className="bg-white rounded-xl shadow-2xl w-[95vw] max-w-[600px] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                Kanban Board
              </h2>
              <button
                onClick={this.props.onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="size-5 text-gray-500" />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center p-10 gap-4">
              <AlertTriangle className="size-12 text-amber-500" />
              <p className="text-gray-700 font-medium text-center">
                Failed to load the Kanban board
              </p>
              <p className="text-sm text-gray-500 text-center max-w-sm">
                This usually happens when the server functions need to be redeployed.
                Try running <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">npx convex push</code> in your terminal.
              </p>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                <RefreshCw className="size-4" />
                Retry
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ─── Main board component ───
interface KanbanBoardProps {
  documentId: Id<"documents">;
}

export const KanbanBoard = ({ documentId }: KanbanBoardProps) => {
  const { setKanbanOpen } = useEditorStore();

  return (
    <KanbanErrorBoundary onClose={() => setKanbanOpen(false)}>
      <KanbanBoardInner documentId={documentId} />
    </KanbanErrorBoundary>
  );
};

// ─── Inner board (wrapped by error boundary) ───
const KanbanBoardInner = ({ documentId }: KanbanBoardProps) => {
  const { setKanbanOpen } = useEditorStore();
  const [boardId, setBoardId] = useState<Id<"kanbanBoards"> | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<Id<"kanbanTasks"> | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const getOrCreateBoard = useMutation(api.kanban.getOrCreateBoard);
  const moveTask = useMutation(api.kanban.moveTask);

  // Initialize board on mount with error handling
  const initBoard = useCallback(async () => {
    try {
      setInitError(null);
      setIsInitializing(true);
      const id = await getOrCreateBoard({ documentId });
      setBoardId(id);
    } catch (err) {
      console.error("Failed to initialize kanban board:", err);
      setInitError(
        err instanceof Error ? err.message : "Failed to initialize board"
      );
    } finally {
      setIsInitializing(false);
    }
  }, [documentId, getOrCreateBoard]);

  useEffect(() => {
    if (!boardId && !initError) {
      initBoard();
    }
  }, [boardId, initError, initBoard]);

  // Use queries only when boardId is available
  const columns = useQuery(
    api.kanban.getColumns,
    boardId ? { boardId } : "skip"
  );

  const tasks = useQuery(
    api.kanban.getTasks,
    boardId ? { boardId } : "skip"
  );

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTaskId(event.active.id as Id<"kanbanTasks">);
  };

  const handleDragOver = (_event: DragOverEvent) => {
    // Visual feedback handled by DragOverlay
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTaskId(null);

    if (!over || !tasks) return;

    const taskId = active.id as Id<"kanbanTasks">;
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;

    // Determine target column — "over" could be a task or a column
    let targetColumnId: Id<"kanbanColumns">;
    let newPosition: number;

    const overTask = tasks.find((t) => t._id === over.id);
    if (overTask) {
      // Dropped on another task — move to that task's column at that position
      targetColumnId = overTask.columnId;
      newPosition = overTask.position;
    } else {
      // Dropped on a column droppable
      targetColumnId = over.id as Id<"kanbanColumns">;
      const columnTasks = tasks.filter((t) => t.columnId === targetColumnId);
      newPosition =
        columnTasks.length > 0
          ? Math.max(...columnTasks.map((t) => t.position)) + 1
          : 0;
    }

    if (task.columnId === targetColumnId && task.position === newPosition) return;

    await moveTask({ taskId, newColumnId: targetColumnId, newPosition });
  };

  const activeTask = tasks?.find((t) => t._id === activeTaskId);

  // Error state
  if (initError) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-8 print:hidden">
        <div className="bg-white rounded-xl shadow-2xl w-[95vw] max-w-[600px] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
              Kanban Board
            </h2>
            <button
              onClick={() => setKanbanOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="size-5 text-gray-500" />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center p-10 gap-4">
            <AlertTriangle className="size-12 text-amber-500" />
            <p className="text-gray-700 font-medium text-center">
              Failed to load the Kanban board
            </p>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              Please redeploy your Convex functions. Run{" "}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">
                npx convex push
              </code>{" "}
              in your terminal, then retry.
            </p>
            <button
              onClick={() => {
                setInitError(null);
                setBoardId(null);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              <RefreshCw className="size-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-8 print:hidden">
      <div
        className="bg-white rounded-xl shadow-2xl w-[95vw] max-w-[1200px] max-h-[90vh] flex flex-col overflow-hidden"
        style={{ animation: "kanban-slide-in 0.25s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
            Kanban Board
          </h2>
          <button
            onClick={() => setKanbanOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="size-5 text-gray-500" />
          </button>
        </div>

        {/* Board Content */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
          {columns && tasks && boardId ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <div className="flex gap-4 h-full min-w-max">
                {columns.map((column) => (
                  <KanbanColumn
                    key={column._id}
                    column={column}
                    tasks={tasks.filter((t) => t.columnId === column._id)}
                    boardId={boardId}
                  />
                ))}
              </div>

              <DragOverlay>
                {activeTask ? (
                  <KanbanTaskCard task={activeTask} isDragOverlay />
                ) : null}
              </DragOverlay>
            </DndContext>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-500">Loading board...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Slide-in animation keyframes */}
      <style jsx>{`
        @keyframes kanban-slide-in {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};
