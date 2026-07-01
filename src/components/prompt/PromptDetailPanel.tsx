"use client";

import Image from "next/image";
import { useState } from "react";
import type { PromptEntry } from "@/types";
import { Badge } from "@/components/ui/Badge";

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

function PropertyRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[80px_1fr] items-baseline gap-xs">
      <span className="text-caption text-subtle shrink-0">{label}</span>
      <span className="text-sm text-body">{value}</span>
    </div>
  );
}

function Section({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-caption font-semibold text-subtle uppercase tracking-normal mb-xxs">
        {label}
      </p>
      <p className="text-sm text-body leading-body">{value}</p>
    </div>
  );
}

export function PromptDetailPanel({
  entry,
  onClose,
  isClosing = false,
}: PromptDetailPanelProps) {
  const [copied, setCopied] = useState(false);
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
      {/* Hero */}
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
      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* 제목 + 배지 + 프로퍼티 */}
        <div className="px-lg pt-lg pb-md border-b border-hairline">
          <div className="flex flex-wrap gap-1 mb-sm">
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

          <h2 className="text-2xl font-semibold leading-heading tracking-title text-ink">
            {entry.title}
          </h2>

          <div className="mt-md flex flex-col gap-xs">
            <PropertyRow label="Cell" value={entry.cell} />
            <PropertyRow label="제출자" value={entry.submitter} />
            <PropertyRow label="업무 대분류" value={entry.core} />
          </div>
        </div>

        {/* 업무 상황 + Prompt 제목 */}
        <div className="px-lg py-md flex flex-col gap-md border-b border-hairline">
          <Section label="업무 상황" value={entry.usage} />
          <Section label="Prompt 제목" value={entry.promptSummary} />
        </div>

        {/* 최종 제출 Prompt */}
        <div className="px-lg py-md border-b border-hairline">
          <p className="text-caption font-semibold text-subtle uppercase tracking-normal mb-sm">
            최종 제출 Prompt
          </p>
          <div className="group relative">
            <pre className="text-xs text-muted bg-surface-soft border border-hairline rounded-lg p-md whitespace-pre-wrap font-mono leading-body">
              {entry.promptText}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-sm right-sm opacity-0 group-hover:opacity-100 transition-opacity bg-canvas border border-hairline text-caption font-medium text-muted px-sm py-xxs rounded-md shadow-sm hover:bg-surface-card"
            >
              {copied ? "✓ 복사됨" : "복사"}
            </button>
          </div>
        </div>

        {/* 활용 AI */}
        {entry.aiTools.length > 0 && (
          <div className="px-lg py-md border-b border-hairline">
            <p className="text-caption font-semibold text-subtle uppercase tracking-normal mb-sm">
              활용 AI
            </p>
            <div className="flex flex-wrap gap-1">
              {entry.aiTools.map((tool) => (
                <Badge key={tool} variant="tool">
                  {tool}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 결과 링크 */}
        {entry.resultFileUrl && (
          <div className="px-lg py-md border-b border-hairline">
            <p className="text-caption font-semibold text-subtle uppercase tracking-normal mb-sm">
              결과 링크
            </p>
            <a
              href={entry.resultFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-xs text-sm font-medium text-accent hover:underline"
            >
              결과물 보기 →
            </a>
          </div>
        )}

        {/* 활용 방법 */}
        {entry.effect && (
          <div className="px-lg py-md border-b border-hairline">
            <Section label="활용 방법" value={entry.effect} />
          </div>
        )}

        {/* 태그 */}
        {entry.tags.length > 0 && (
          <div className="px-lg py-md">
            <div className="flex flex-wrap gap-1">
              {entry.tags.map((tag) => (
                <Badge key={tag} variant="tag">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
