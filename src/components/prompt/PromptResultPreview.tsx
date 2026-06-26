import Image from "next/image";
import type { PromptEntry } from "@/types";
import { Button } from "@/components/ui/Button";

const RESULT_TYPE_LABEL: Record<string, string> = {
  image: "이미지",
  pdf: "PDF",
  docx: "Word",
  pptx: "PowerPoint",
  xlsx: "Excel",
  video: "영상",
};

interface PromptResultPreviewProps {
  entry: PromptEntry;
}

export function PromptResultPreview({ entry }: PromptResultPreviewProps) {
  return (
    <div className="flex flex-col gap-3">
      {entry.resultImage && (
        <div className="relative rounded-lg overflow-hidden border border-hairline bg-surface-soft aspect-video">
          <Image
            src={entry.resultImage}
            alt={`${entry.title} 결과물`}
            fill
            className="object-contain"
          />
        </div>
      )}

      {entry.resultPreview && (
        <p className="text-sm text-muted leading-relaxed">
          {entry.resultPreview}
        </p>
      )}

      {entry.resultFileUrl && (
        <a
          href={entry.resultFileUrl}
          download={entry.resultFileName ?? true}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="secondary" size="sm" className="w-full">
            <span>⬇</span>
            {RESULT_TYPE_LABEL[entry.resultType] ?? entry.resultType} 다운로드
            {entry.resultFileName && (
              <span className="text-subtle truncate">
                ({entry.resultFileName})
              </span>
            )}
          </Button>
        </a>
      )}
    </div>
  );
}
