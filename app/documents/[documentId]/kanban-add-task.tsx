"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { Mic, MicOff, Save, X } from "lucide-react";
import { toast } from "sonner";

interface KanbanAddTaskProps {
  columnId: Id<"kanbanColumns">;
  boardId: Id<"kanbanBoards">;
  onClose: () => void;
}

export const KanbanAddTask = ({ columnId, boardId, onClose }: KanbanAddTaskProps) => {
  const [content, setContent] = useState("");
  const createTask = useMutation(api.kanban.createTask);

  const {
    transcript,
    interimText,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // Update content with final transcript + current interim text
  useEffect(() => {
    if (transcript || interimText) {
      setContent(transcript + interimText);
    }
  }, [transcript, interimText]);

  const handleSave = async () => {
    const trimmed = content.trim();
    if (!trimmed) {
      toast.error("Task content cannot be empty");
      return;
    }

    try {
      await createTask({ content: trimmed, columnId, boardId });
      toast.success("Task created");
      setContent("");
      resetTranscript();
      onClose();
    } catch {
      toast.error("Failed to create task");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  return (
    <div className="bg-white rounded-lg border-2 border-blue-200 shadow-sm p-3 mb-2 transition-all"
      style={{ animation: "kanban-task-fade-in 0.2s ease-out" }}
    >
      {/* Text Input */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What needs to be done?"
        className="w-full text-sm text-gray-700 border-none resize-none focus:outline-none placeholder:text-gray-400 bg-transparent"
        rows={3}
        autoFocus
      />

      {/* Voice indicator */}
      {isListening && (
        <div className="flex items-center gap-2 px-1 py-1.5 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-2 bg-red-500" />
            </span>
            <span className="text-xs text-red-500 font-medium">Listening...</span>
          </div>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        {/* Voice Button */}
        <div>
          {isSupported ? (
            <button
              onClick={toggleVoice}
              className={`p-2 rounded-lg transition-all ${isListening
                ? "bg-red-50 text-red-500 hover:bg-red-100 ring-2 ring-red-200"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              title={isListening ? "Stop recording" : "Start voice input"}
            >
              {isListening ? (
                <MicOff className="size-4" />
              ) : (
                <Mic className="size-4" />
              )}
            </button>
          ) : (
            <span className="text-xs text-gray-400">Voice not supported</span>
          )}
        </div>

        {/* Save / Cancel */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X className="size-3" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors font-medium"
          >
            <Save className="size-3" />
            Save
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes kanban-task-fade-in {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
