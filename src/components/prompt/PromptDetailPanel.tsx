"use client";

import Image from "next/image";
import { useState } from "react";
import type { PromptEntry } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PromptResultPreview } from "./PromptResultPreview";

const CATEGORY_META: Record<string, { icon: string; bg: string }> = {
  "개발/자동화": { icon: "⚙️", bg: "bg-category-dev" },
  "콘텐츠 제작": { icon: "✏️", bg: "bg-category-content" },
  "업무 운영": { icon: "📊", bg: "bg-category-ops" },
  고객관리: { icon: "💬", bg: "bg-category-crm" },
  "기획/검토": { icon: "🔍", bg: "bg-category-plan" },
};

interface PromptDetailPanelProps {
  entry: PromptEntry;
  onClose: () => void;
  isClosing?: boolean;
}

export function PromptDetailPanel({
  entry,
  onClose,
  isClosing = false,
}: PromptDetailPanelProps) {
  const [copied, setCopied] = useState(false);
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const meta = CATEGORY_META[entry.category] ?? {
    icon: "📌",
    bg: "bg-surface-soft",
  };
  const heroImage = entry.thumbnail ?? entry.resultImage;

  async function handleCopy() {
    await navigator.clipboard.writeText(entry.promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <aside
      className="w-full h-full flex flex-col overflow-hidden"
      style={{
        animation: isClosing
          ? "panel-slide-out 0.25s ease-in forwards"
          : "panel-slide-in 0.25s ease-out",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div
        className={`relative h-40 flex-shrink-0 ${meta.bg} flex items-center justify-center`}
      >
        {heroImage ? (
          <Image
            src={heroImage}
            alt={entry.title}
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-5xl select-none">{meta.icon}</span>
        )}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 bg-canvas/90 backdrop-blur rounded-pill flex items-center justify-center text-muted hover:bg-canvas transition-colors shadow-sm text-sm"
          aria-label="닫기"
        >
          ✕
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-xs flex flex-col gap-xs">
        {/* Title + Badges */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-1">
            <Badge variant="award" value={entry.award}>
              {entry.award}
            </Badge>
            <Badge variant="category">{entry.category}</Badge>
            {entry.aiTools.map((tool) => (
              <Badge key={tool} variant="tool">
                {tool}
              </Badge>
            ))}
          </div>
          <h2 className="text-lg font-bold text-ink leading-snug">
            {entry.title}
          </h2>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-x-md gap-y-3 text-sm">
          <div>
            <p className="text-caption text-subtle mb-0.5">Core</p>
            <p className="text-body font-medium">{entry.core}</p>
          </div>
          <div>
            <p className="text-caption text-subtle mb-0.5">Cell</p>
            <p className="text-body font-medium">{entry.cell}</p>
          </div>
          <div>
            <p className="text-caption text-subtle mb-0.5">제출자</p>
            <p className="text-body font-medium">{entry.submitter}</p>
          </div>
          <div>
            <p className="text-caption text-subtle mb-0.5">반복 유형</p>
            <p className="text-body font-medium">{entry.repeatType}</p>
          </div>
          <div className="col-span-2">
            <p className="text-caption text-subtle mb-0.5">재사용 활용</p>
            <p
              className={`text-sm font-medium ${entry.reuseType ? "text-reuse-text" : "text-subtle"}`}
            >
              {entry.reuseType ? "✓ 재사용 가능" : "단발성 활용"}
            </p>
          </div>
        </div>

        <hr className="border-hairline" />

        {/* Business context */}
        <div className="flex flex-col gap-md">
          <div>
            <p className="text-caption font-semibold text-subtle uppercase tracking-wide mb-1">
              업무 목적
            </p>
            <p className="text-sm text-body leading-relaxed">{entry.purpose}</p>
          </div>
          <div>
            <p className="text-caption font-semibold text-subtle uppercase tracking-wide mb-1">
              활용 상황
            </p>
            <p className="text-sm text-body leading-relaxed">{entry.usage}</p>
          </div>
          <div>
            <p className="text-caption font-semibold text-subtle uppercase tracking-wide mb-1">
              활용 효과
            </p>
            <p className="text-sm text-body leading-relaxed">{entry.effect}</p>
          </div>
        </div>

        <hr className="border-hairline" />

        {/* Prompt */}
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-caption font-semibold text-subtle uppercase tracking-wide mb-1">
              Prompt 요약
            </p>
            <p className="text-sm text-body leading-relaxed">
              {entry.promptSummary}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-caption font-semibold text-subtle uppercase tracking-wide">
                Prompt 전문
              </p>
              <button
                onClick={() => setShowFullPrompt((p) => !p)}
                className="text-xs text-subtle hover:text-muted transition-colors"
              >
                {showFullPrompt ? "접기 ▲" : "펼치기 ▼"}
              </button>
            </div>

            {showFullPrompt && (
              <pre className="text-xs text-muted bg-surface-soft border border-hairline rounded-lg p-3 whitespace-pre-wrap font-mono leading-relaxed mb-2">
                {entry.promptText}
              </pre>
            )}

            <Button
              onClick={handleCopy}
              variant="secondary"
              size="sm"
              className="w-full"
            >
              {copied ? "✓ 복사됨" : "📋 Prompt 복사"}
            </Button>
          </div>
        </div>

        <hr className="border-hairline" />

        {/* Result preview */}
        <div className="flex flex-col gap-2">
          <p className="text-caption font-semibold text-subtle uppercase tracking-wide">
            결과물 미리보기
          </p>
          <PromptResultPreview entry={entry} />
        </div>

        {/* Tags + Pack candidate */}
        <div className="flex flex-col gap-2">
          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {entry.tags.map((tag) => (
                <Badge key={tag} variant="tag">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
          {entry.packCandidate && (
            <div className="flex items-center gap-1.5 text-xs text-pack-text bg-pack-bg border border-pack-border rounded-lg px-3 py-2">
              <span>⭐</span>
              <span className="font-medium">Pack 후보 선정</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
