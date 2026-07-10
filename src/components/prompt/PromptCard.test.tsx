import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { PromptEntry } from "@/types";
import { PromptCard } from "./PromptCard";

function createEntry(overrides: Partial<PromptEntry> = {}): PromptEntry {
  return {
    id: "award-008",
    award: "Best",
    title: "버그 최소화 개발 Prompt",
    category: "개발/자동화",
    core: "업무 관리",
    cell: "DX추진3 Cell",
    submitter: "홍길동",
    aiTools: ["Claude"],
    repeatType: "바로 복붙",
    reuseType: true,
    purpose: "버그 최소화",
    usage: "동일 업무를 하는 구성원에게 활용 가능",
    effect: "실제 개발중 신규 기능 개발 및 버그 수정",
    promptSummary: "요약",
    promptText: "프롬프트 텍스트",
    resultType: "image",
    resultDesc: "결과 이미지",
    resultPreview: "/results/award-008/result.png",
    previewImages: ["/results/award-008/result.png"],
    resultFileUrl: null,
    resultFileName: null,
    tags: ["업무 관리", "개발/자동화"],
    packCandidate: false,
    ...overrides,
  };
}

describe("PromptCard", () => {
  it("제목과 카테고리를 렌더링한다", () => {
    render(
      <PromptCard entry={createEntry()} isSelected={false} onClick={vi.fn()} />,
    );
    expect(
      screen.getByRole("heading", { name: "버그 최소화 개발 Prompt" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("개발/자동화").length).toBeGreaterThan(0);
  });

  it("추천작이 아니면 award 배지를 렌더링한다", () => {
    render(
      <PromptCard entry={createEntry()} isSelected={false} onClick={vi.fn()} />,
    );
    expect(screen.getByText("Best")).toBeInTheDocument();
  });

  it("추천작이면 award 배지를 렌더링하지 않는다", () => {
    render(
      <PromptCard
        entry={createEntry({ award: "추천작" })}
        isSelected={false}
        onClick={vi.fn()}
      />,
    );
    expect(screen.queryByText("추천작")).not.toBeInTheDocument();
  });

  it("클릭 시 onClick이 호출된다", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <PromptCard entry={createEntry()} isSelected={false} onClick={onClick} />,
    );

    await user.click(
      screen.getByRole("heading", { name: "버그 최소화 개발 Prompt" }),
    );

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("isSelected=true면 선택 스타일 클래스가 적용된다", () => {
    const { container } = render(
      <PromptCard entry={createEntry()} isSelected={true} onClick={vi.fn()} />,
    );
    const article = container.querySelector("article");
    expect(article?.className).toContain("border-selected");
  });

  it("previewImages가 없으면 카테고리 아이콘 placeholder를 보여준다", () => {
    const { container } = render(
      <PromptCard
        entry={createEntry({ previewImages: [] })}
        isSelected={false}
        onClick={vi.fn()}
      />,
    );
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });
});
