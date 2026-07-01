"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import type { PromptEntry } from "@/types";
import { PromptCard } from "./PromptCard";
import { PromptDetailPanel } from "./PromptDetailPanel";

const CATEGORIES = [
  "전체",
  "개발/자동화",
  "콘텐츠 제작",
  "업무 운영",
  "고객관리",
  "기획/검토",
];

interface PromptGalleryProps {
  entries: PromptEntry[];
}

export function PromptGallery({ entries }: PromptGalleryProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [displayedId, setDisplayedId] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("전체");
  const [panelWidth, setPanelWidth] = useState(480);
  const [isDragging, setIsDragging] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragState = useRef<{ startX: number; startWidth: number } | null>(null);

  useEffect(() => {
    const saved = Number(localStorage.getItem("v-prompt-panel-width"));
    if (saved >= 300 && saved <= 800) setPanelWidth(saved);
  }, []);

  const handleDragStart = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      dragState.current = { startX: e.clientX, startWidth: panelWidth };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setIsDragging(true);
    },
    [panelWidth],
  );

  const handleDragMove = useCallback((e: React.PointerEvent) => {
    if (!dragState.current) return;
    const delta = dragState.current.startX - e.clientX;
    const next = Math.min(
      800,
      Math.max(300, dragState.current.startWidth + delta),
    );
    setPanelWidth(next);
  }, []);

  const handleDragEnd = useCallback(() => {
    dragState.current = null;
    setIsDragging(false);
    setPanelWidth((prev) => {
      localStorage.setItem("v-prompt-panel-width", String(prev));
      return prev;
    });
  }, []);

  const filtered = useMemo(
    () =>
      activeCategory === "전체"
        ? entries
        : entries.filter((e) => e.category === activeCategory),
    [entries, activeCategory],
  );

  const displayed = useMemo(
    () => entries.find((e) => e.id === displayedId) ?? null,
    [entries, displayedId],
  );

  function closePanel() {
    setIsClosing(true);
    setSelectedId(null);
    closeTimer.current = setTimeout(() => {
      setIsClosing(false);
      setDisplayedId(null);
    }, 300);
  }

  function instantClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setSelectedId(null);
    setDisplayedId(null);
    setIsClosing(false);
  }

  function handleCardClick(entry: PromptEntry) {
    if (selectedId === entry.id) {
      closePanel();
      return;
    }
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setIsClosing(false);
    setSelectedId(entry.id);
    setDisplayedId(entry.id);
  }

  function handleCategoryChange(cat: string) {
    setActiveCategory(cat);
    instantClose();
  }

  const panelOpen = !!selectedId || isClosing;

  return (
    <div className="flex items-start">
      {/* Gallery */}
      <div className="flex-1 min-w-0">
        <div className="mx-auto max-w-7xl px-lg py-xl" onClick={instantClose}>
          {/* Category Toolbar */}
          <div className="flex flex-wrap items-center gap-2 mb-lg pb-lg border-b border-hairline">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCategoryChange(cat);
                }}
                className={`px-md py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-on-primary"
                    : "bg-surface-card text-muted hover:bg-surface-strong"
                }`}
              >
                {cat}
                {cat === "전체" && (
                  <span className="ml-1.5 text-xs opacity-60">
                    {entries.length}
                  </span>
                )}
              </button>
            ))}
            <span className="ml-auto text-sm text-subtle">
              {filtered.length}개
            </span>
          </div>

          {/* Card grid */}
          <div className="grid gap-md grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.length === 0 ? (
              <p className="col-span-full text-subtle py-16 text-center text-sm">
                해당 카테고리에 수상작이 없습니다.
              </p>
            ) : (
              filtered.map((entry) => (
                <PromptCard
                  key={entry.id}
                  entry={entry}
                  isSelected={entry.id === selectedId}
                  onClick={() => handleCardClick(entry)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Panel wrapper */}
      <div
        className={`sticky top-0 h-screen flex-shrink-0 overflow-hidden border-l border-hairline bg-canvas ${
          !isDragging ? "transition-[width] duration-300 ease-out" : ""
        }`}
        style={{ width: panelOpen ? panelWidth : 0 }}
      >
        {/* Drag handle */}
        {panelOpen && (
          <div
            className="absolute left-0 top-0 w-1.5 h-full z-20 cursor-col-resize group"
            onPointerDown={handleDragStart}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
          >
            <div className="w-full h-full group-hover:bg-primary/30 transition-colors" />
          </div>
        )}
        {displayed && (
          <PromptDetailPanel
            entry={displayed}
            onClose={closePanel}
            isClosing={isClosing}
          />
        )}
      </div>
    </div>
  );
}
