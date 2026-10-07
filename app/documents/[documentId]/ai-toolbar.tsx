"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { type Editor } from "@tiptap/react";
import {
  SparklesIcon,
  CheckIcon,
  XIcon,
  Loader2Icon,
  WandSparklesIcon,
  FileTextIcon,
  SmilePlusIcon,
  ScissorsIcon,
  ExpandIcon,
  LanguagesIcon,
  ListIcon,
  BookOpenIcon,
  ChevronRightIcon,
} from "lucide-react";

type AiAction =
  | "improve"
  | "summarize"
  | "fix_grammar"
  | "tone"
  | "make_shorter"
  | "make_longer"
  | "explain"
  | "translate"
  | "bullet_points";

interface AiToolbarProps {
  editor: Editor | null;
}

const TONES = [
  { label: "Formal", value: "formal", emoji: "🎩" },
  { label: "Casual", value: "casual", emoji: "😊" },
  { label: "Friendly", value: "friendly", emoji: "🤗" },
  { label: "Professional", value: "professional", emoji: "💼" },
  { label: "Academic", value: "academic", emoji: "🎓" },
  { label: "Creative", value: "creative", emoji: "🎨" },
];

const LANGUAGES = [
  { label: "Spanish", value: "Spanish" },
  { label: "French", value: "French" },
  { label: "German", value: "German" },
  { label: "Hindi", value: "Hindi" },
  { label: "Chinese", value: "Chinese" },
  { label: "Japanese", value: "Japanese" },
  { label: "Arabic", value: "Arabic" },
  { label: "Portuguese", value: "Portuguese" },
];

export const AiToolbar = ({ editor }: AiToolbarProps) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<AiAction | null>(null);
  const [showToneMenu, setShowToneMenu] = useState(false);
  const [showTranslateMenu, setShowTranslateMenu] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const toolbarRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    if (from === to) {
      setShowToolbar(false);
      setResult(null);
      setActiveAction(null);
      setShowToneMenu(false);
      setShowTranslateMenu(false);
      return;
    }

    const text = editor.state.doc.textBetween(from, to, " ");
    if (!text.trim()) {
      setShowToolbar(false);
      return;
    }

    setSelectedText(text);

    // Get the DOM coordinates of the selection
    const view = editor.view;
    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);

    // Position relative to the editor container
    const editorElement = view.dom.closest(".size-full");
    if (!editorElement) return;

    const editorRect = editorElement.getBoundingClientRect();
    const top = start.top - editorRect.top - 55;
    const left = (start.left + end.left) / 2 - editorRect.left;

    setPosition({ top: Math.max(0, top), left: Math.max(60, left) });
    setShowToolbar(true);
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    editor.on("selectionUpdate", updatePosition);
    editor.on("blur", () => {
      // Delay hide to allow clicking toolbar buttons
      setTimeout(() => {
        const toolbar = toolbarRef.current;
        const resultPanel = resultRef.current;
        if (
          toolbar &&
          !toolbar.contains(document.activeElement) &&
          !toolbar.matches(":hover") &&
          (!resultPanel || !resultPanel.matches(":hover"))
        ) {
          setShowToolbar(false);
          setResult(null);
          setActiveAction(null);
          setShowToneMenu(false);
          setShowTranslateMenu(false);
        }
      }, 200);
    });

    return () => {
      editor.off("selectionUpdate", updatePosition);
    };
  }, [editor, updatePosition]);

  const callAi = async (
    action: AiAction,
    options?: { tone?: string; language?: string }
  ) => {
    if (!selectedText.trim()) return;

    setLoading(true);
    setActiveAction(action);
    setResult(null);
    setShowToneMenu(false);
    setShowTranslateMenu(false);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, text: selectedText, options }),
      });

      const data = await response.json();
      if (data.error) {
        setResult(`❌ ${data.error}`);
      } else {
        setResult(data.result);
      }
    } catch {
      setResult("❌ Failed to connect to AI service.");
    } finally {
      setLoading(false);
    }
  };

  const acceptResult = () => {
    if (!editor || !result || result.startsWith("❌")) return;

    const { from, to } = editor.state.selection;
    editor.chain().focus().deleteRange({ from, to }).insertContentAt(from, result).run();

    setResult(null);
    setActiveAction(null);
    setShowToolbar(false);
  };

  const discardResult = () => {
    setResult(null);
    setActiveAction(null);
  };

  if (!showToolbar || !editor) return null;

  const actions = [
    { action: "improve" as AiAction, icon: WandSparklesIcon, label: "Improve", color: "text-violet-400" },
    { action: "fix_grammar" as AiAction, icon: SparklesIcon, label: "Fix Grammar", color: "text-emerald-400" },
    { action: "summarize" as AiAction, icon: FileTextIcon, label: "Summarize", color: "text-blue-400" },
    { action: "make_shorter" as AiAction, icon: ScissorsIcon, label: "Shorter", color: "text-orange-400" },
    { action: "make_longer" as AiAction, icon: ExpandIcon, label: "Longer", color: "text-pink-400" },
    { action: "explain" as AiAction, icon: BookOpenIcon, label: "Explain", color: "text-cyan-400" },
    { action: "bullet_points" as AiAction, icon: ListIcon, label: "Bullets", color: "text-yellow-400" },
  ];

  return (
    <>
      {/* Floating AI Toolbar */}
      <div
        ref={toolbarRef}
        className="absolute z-50 flex items-center gap-0.5 px-1.5 py-1 rounded-xl shadow-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-2 duration-200"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: "translateX(-50%)",
          background: "linear-gradient(135deg, rgba(30,27,55,0.95) 0%, rgba(45,35,80,0.95) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
        onMouseDown={(e) => e.preventDefault()}
      >
        {/* AI Icon */}
        <div className="flex items-center gap-1 px-1.5 py-0.5 mr-0.5">
          <SparklesIcon className="size-3.5 text-violet-400" />
          <span className="text-[10px] font-semibold text-violet-300 tracking-wide uppercase">
            AI
          </span>
        </div>

        <div className="w-px h-5 bg-white/10" />

        {/* Action Buttons */}
        {actions.map(({ action, icon: Icon, label, color }) => (
          <button
            key={action}
            onClick={() => callAi(action)}
            disabled={loading}
            className={`
              group relative flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium
              text-white/70 hover:text-white hover:bg-white/10
              transition-all duration-150
              disabled:opacity-40 disabled:cursor-not-allowed
              ${activeAction === action ? "bg-white/15 text-white" : ""}
            `}
            title={label}
          >
            <Icon className={`size-3.5 ${activeAction === action ? color : "text-white/50 group-hover:text-white/80"}`} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}

        <div className="w-px h-5 bg-white/10" />

        {/* Tone Button with Sub-menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowToneMenu(!showToneMenu);
              setShowTranslateMenu(false);
            }}
            disabled={loading}
            className={`
              group flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium
              text-white/70 hover:text-white hover:bg-white/10
              transition-all duration-150 disabled:opacity-40
              ${showToneMenu ? "bg-white/15 text-white" : ""}
            `}
          >
            <SmilePlusIcon className="size-3.5 text-white/50 group-hover:text-white/80" />
            <span className="hidden sm:inline">Tone</span>
            <ChevronRightIcon className="size-3 text-white/40" />
          </button>

          {showToneMenu && (
            <div
              className="absolute top-full left-0 mt-1 py-1 rounded-xl shadow-2xl border border-white/15 min-w-[160px] animate-in fade-in slide-in-from-top-1 duration-150"
              style={{
                background: "linear-gradient(135deg, rgba(30,27,55,0.98) 0%, rgba(45,35,80,0.98) 100%)",
                backdropFilter: "blur(20px)",
              }}
            >
              {TONES.map(({ label, value, emoji }) => (
                <button
                  key={value}
                  onClick={() => callAi("tone", { tone: value })}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <span>{emoji}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Translate Button with Sub-menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowTranslateMenu(!showTranslateMenu);
              setShowToneMenu(false);
            }}
            disabled={loading}
            className={`
              group flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium
              text-white/70 hover:text-white hover:bg-white/10
              transition-all duration-150 disabled:opacity-40
              ${showTranslateMenu ? "bg-white/15 text-white" : ""}
            `}
          >
            <LanguagesIcon className="size-3.5 text-white/50 group-hover:text-white/80" />
            <span className="hidden sm:inline">Translate</span>
            <ChevronRightIcon className="size-3 text-white/40" />
          </button>

          {showTranslateMenu && (
            <div
              className="absolute top-full right-0 mt-1 py-1 rounded-xl shadow-2xl border border-white/15 min-w-[140px] animate-in fade-in slide-in-from-top-1 duration-150"
              style={{
                background: "linear-gradient(135deg, rgba(30,27,55,0.98) 0%, rgba(45,35,80,0.98) 100%)",
                backdropFilter: "blur(20px)",
              }}
            >
              {LANGUAGES.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => callAi("translate", { language: value })}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Result Preview Panel */}
      {(loading || result) && (
        <div
          ref={resultRef}
          className="absolute z-50 w-[420px] rounded-2xl shadow-2xl border border-white/15 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-300"
          style={{
            top: `${position.top + 50}px`,
            left: `${position.left}px`,
            transform: "translateX(-50%)",
            background: "linear-gradient(145deg, rgba(22,20,45,0.98) 0%, rgba(40,32,72,0.98) 100%)",
            backdropFilter: "blur(24px)",
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {/* Header */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10"
            style={{
              background: "linear-gradient(90deg, rgba(124,58,237,0.2) 0%, rgba(99,102,241,0.2) 100%)",
            }}
          >
            {loading ? (
              <Loader2Icon className="size-4 text-violet-400 animate-spin" />
            ) : (
              <SparklesIcon className="size-4 text-violet-400" />
            )}
            <span className="text-xs font-semibold text-white/90">
              {loading ? "AI is thinking..." : "AI Suggestion"}
            </span>
            {activeAction && (
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-medium">
                {activeAction.replace("_", " ")}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="px-4 py-3 max-h-[250px] overflow-y-auto">
            {loading ? (
              <div className="space-y-2">
                <div className="h-3 bg-white/5 rounded-full animate-pulse w-full" />
                <div className="h-3 bg-white/5 rounded-full animate-pulse w-4/5" />
                <div className="h-3 bg-white/5 rounded-full animate-pulse w-3/5" />
              </div>
            ) : (
              <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                {result}
              </p>
            )}
          </div>

          {/* Actions */}
          {result && !loading && !result.startsWith("❌") && (
            <div className="flex items-center gap-2 px-4 py-2.5 border-t border-white/10">
              <button
                onClick={acceptResult}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-colors"
              >
                <CheckIcon className="size-3.5" />
                Accept
              </button>
              <button
                onClick={discardResult}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/90 text-xs font-medium transition-colors border border-white/10"
              >
                <XIcon className="size-3.5" />
                Discard
              </button>
            </div>
          )}

          {result && result.startsWith("❌") && (
            <div className="flex items-center gap-2 px-4 py-2.5 border-t border-white/10">
              <button
                onClick={discardResult}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/90 text-xs font-medium transition-colors"
              >
                <XIcon className="size-3.5" />
                Dismiss
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
