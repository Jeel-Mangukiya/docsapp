"use client";

import React, { useState, useRef, useEffect } from "react";
import { useEditorStore } from "@/store/use-editor-store";
import {
  SparklesIcon,
  XIcon,
  SendIcon,
  Loader2Icon,
  PenLineIcon,
  MailIcon,
  FileTextIcon,
  BookOpenIcon,
  PresentationIcon,
  CheckIcon,
  CopyIcon,
  RotateCcwIcon,
  ArrowDownIcon,
  WandSparklesIcon,
} from "lucide-react";

const PRESETS = [
  { label: "Blog Post", icon: PenLineIcon, prompt: "Write a blog post about " },
  { label: "Email", icon: MailIcon, prompt: "Write a professional email about " },
  { label: "Summary", icon: FileTextIcon, prompt: "Write a brief summary about " },
  { label: "Story", icon: BookOpenIcon, prompt: "Write a short story about " },
  { label: "Presentation", icon: PresentationIcon, prompt: "Write presentation slides content about " },
  { label: "Letter", icon: FileTextIcon, prompt: "Write a formal letter about " },
];

export const AiSidebar = () => {
  const { editor, isAiSidebarOpen, setAiSidebarOpen } = useEditorStore();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"generate" | "continue">("generate");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAiSidebarOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isAiSidebarOpen, activeTab]);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [result]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          text: prompt.trim(),
        }),
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

  const handleContinueWriting = async () => {
    if (!editor) return;

    // Get text content before cursor position
    const { from } = editor.state.selection;
    const textBefore = editor.state.doc.textBetween(0, from, "\n");

    if (!textBefore.trim()) {
      setResult("❌ Please write some text first, then place your cursor where you want to continue.");
      return;
    }

    // Take last 1500 chars for context
    const context = textBefore.slice(-1500);

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "continue",
          text: context,
        }),
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

  const insertAtCursor = () => {
    if (!editor || !result || result.startsWith("❌")) return;

    const { from } = editor.state.selection;
    editor.chain().focus().insertContentAt(from, result).run();

    setResult(null);
    setPrompt("");
  };

  const replaceAll = () => {
    if (!editor || !result || result.startsWith("❌")) return;

    editor.chain().focus().clearContent().insertContent(result).run();

    setResult(null);
    setPrompt("");
  };

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isAiSidebarOpen) return null;

  return (
    <div
      className="fixed right-0 top-0 bottom-0 w-[400px] z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
      style={{
        background: "linear-gradient(180deg, #0f0d1a 0%, #1a1530 50%, #0f0d1a 100%)",
        borderLeft: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b border-white/8 shrink-0"
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(99,102,241,0.1) 50%, rgba(168,85,247,0.08) 100%)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-xl"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)",
              boxShadow: "0 0 20px rgba(124,58,237,0.4)",
            }}
          >
            <SparklesIcon className="size-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">AI Assistant</h3>
            <p className="text-[10px] text-white/40 font-medium">Powered by docs</p>
          </div>
        </div>
        <button
          onClick={() => setAiSidebarOpen(false)}
          className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
        >
          <XIcon className="size-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex px-5 pt-4 pb-2 gap-1 shrink-0">
        <button
          onClick={() => { setActiveTab("generate"); setResult(null); }}
          className={`
            flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200
            ${activeTab === "generate"
              ? "bg-violet-600/30 text-violet-300 border border-violet-500/30 shadow-lg shadow-violet-500/10"
              : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
            }
          `}
        >
          <WandSparklesIcon className="size-3.5" />
          Generate
        </button>
        <button
          onClick={() => { setActiveTab("continue"); setResult(null); }}
          className={`
            flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200
            ${activeTab === "continue"
              ? "bg-violet-600/30 text-violet-300 border border-violet-500/30 shadow-lg shadow-violet-500/10"
              : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
            }
          `}
        >
          <PenLineIcon className="size-3.5" />
          Continue Writing
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-h-0 px-5 pb-4">
        {activeTab === "generate" ? (
          <>
            {/* Presets */}
            <div className="mb-3 shrink-0">
              <p className="text-[10px] text-white/30 font-semibold uppercase tracking-wider mb-2">
                Quick Presets
              </p>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map(({ label, icon: Icon, prompt: p }) => (
                  <button
                    key={label}
                    onClick={() => setPrompt(p)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-white/50 
                               border border-white/8 hover:border-violet-500/30 hover:text-violet-300 hover:bg-violet-500/10
                               transition-all duration-200"
                  >
                    <Icon className="size-3" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div className="relative mb-3 shrink-0">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
                placeholder="Describe what you want to write..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl text-sm text-white/90 placeholder:text-white/25 resize-none
                           border border-white/10 focus:border-violet-500/40 focus:outline-none
                           transition-colors duration-200"
                style={{
                  background: "rgba(255,255,255,0.03)",
                }}
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="absolute bottom-3 right-3 p-2 rounded-lg bg-violet-600 hover:bg-violet-500 
                           text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200
                           shadow-lg shadow-violet-600/30"
              >
                {loading ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  <SendIcon className="size-4" />
                )}
              </button>
            </div>
          </>
        ) : (
          /* Continue Writing Tab */
          <div className="mb-3 shrink-0">
            <div
              className="p-4 rounded-xl border border-white/8 mb-3"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-violet-500/15 shrink-0 mt-0.5">
                  <PenLineIcon className="size-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white/80 mb-1">Continue Writing</p>
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    Place your cursor in the editor where you want to continue, then click the button below.
                    AI will read the text before your cursor and write a natural continuation.
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleContinueWriting}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold
                         text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 shadow-lg shadow-violet-600/30"
            >
              {loading ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="size-4" />
                  Continue from Cursor
                </>
              )}
            </button>
          </div>
        )}

        {/* Result */}
        {(loading || result) && (
          <div
            ref={resultRef}
            className="flex-1 flex flex-col min-h-0 rounded-xl border border-white/10 overflow-hidden animate-in fade-in duration-300"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            {/* Result Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/8 shrink-0"
              style={{
                background: "linear-gradient(90deg, rgba(124,58,237,0.1) 0%, rgba(99,102,241,0.1) 100%)",
              }}
            >
              <div className="flex items-center gap-2">
                {loading ? (
                  <Loader2Icon className="size-3.5 text-violet-400 animate-spin" />
                ) : (
                  <SparklesIcon className="size-3.5 text-violet-400" />
                )}
                <span className="text-xs font-semibold text-white/80">
                  {loading ? "Generating..." : "AI Result"}
                </span>
              </div>
              {result && !result.startsWith("❌") && (
                <button
                  onClick={copyResult}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
                >
                  {copied ? <CheckIcon className="size-3 text-emerald-400" /> : <CopyIcon className="size-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
            </div>

            {/* Result Body */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {loading ? (
                <div className="space-y-2.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-3 bg-white/5 rounded-full animate-pulse"
                      style={{ width: `${85 - i * 12}%`, animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-white/75 leading-relaxed whitespace-pre-wrap">
                  {result}
                </p>
              )}
            </div>

            {/* Result Actions */}
            {result && !loading && !result.startsWith("❌") && (
              <div className="flex items-center gap-2 px-4 py-3 border-t border-white/8 shrink-0">
                <button
                  onClick={insertAtCursor}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg 
                             bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold
                             transition-colors shadow-lg shadow-violet-600/20"
                >
                  <ArrowDownIcon className="size-3.5" />
                  Insert at Cursor
                </button>
                <button
                  onClick={replaceAll}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg 
                             bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-medium
                             transition-colors border border-white/10"
                >
                  <RotateCcwIcon className="size-3.5" />
                  Replace All
                </button>
                <button
                  onClick={() => setResult(null)}
                  className="flex items-center justify-center p-2 rounded-lg 
                             bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/70
                             transition-colors border border-white/10"
                >
                  <XIcon className="size-3.5" />
                </button>
              </div>
            )}

            {result && result.startsWith("❌") && (
              <div className="flex items-center gap-2 px-4 py-3 border-t border-white/8 shrink-0">
                <button
                  onClick={() => setResult(null)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 
                             text-white/60 text-xs font-medium transition-colors"
                >
                  <XIcon className="size-3.5" />
                  Dismiss
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
