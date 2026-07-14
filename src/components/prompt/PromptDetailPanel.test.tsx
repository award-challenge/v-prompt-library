import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { PromptEntry } from "@/types";
import { PromptDetailPanel } from "./PromptDetailPanel";

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
    promptSummary:
      "대상 파일, 변경 위치, 변경 이유를 정리해 버그를 최소화합니다.",
    promptText: "다음 항목을 정리해줘",
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

describe("PromptDetailPanel", () => {
  it("제목과 요약을 렌더링한다", () => {
    render(<PromptDetailPanel entry={createEntry()} onClose={vi.fn()} />);
    expect(
      screen.getByRole("heading", { name: "버그 최소화 개발 Prompt" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/대상 파일, 변경 위치, 변경 이유/),
    ).toBeInTheDocument();
  });

  it("닫기 버튼 클릭 시 onClose가 호출된다", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<PromptDetailPanel entry={createEntry()} onClose={onClose} />);

    await user.click(screen.getByLabelText("패널 닫기"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("추천작이면 award 배지를 렌더링하지 않는다", () => {
    render(
      <PromptDetailPanel
        entry={createEntry({ award: "추천작" })}
        onClose={vi.fn()}
      />,
    );
    expect(screen.queryByText("추천작")).not.toBeInTheDocument();
  });

  it("packCandidate=true면 팩 후보 표시가 나타난다", () => {
    render(
      <PromptDetailPanel
        entry={createEntry({ packCandidate: true })}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText("활용 가능")).toBeInTheDocument();
  });

  it("resultFileUrl이 있으면 최종 결과물 링크를 렌더링한다", () => {
    render(
      <PromptDetailPanel
        entry={createEntry({ resultFileUrl: "https://example.com/result" })}
        onClose={vi.fn()}
      />,
    );
    const link = screen.getByRole("link", { name: /example\.com\/result/ });
    expect(link).toHaveAttribute("href", "https://example.com/result");
  });

  it("Copy 버튼 클릭 시 promptText 전문을 클립보드에 복사한다", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    render(<PromptDetailPanel entry={createEntry()} onClose={vi.fn()} />);
    // Copy 버튼은 opacity-0 group-hover로 노출되어 userEvent의 포인터 위치
    // 기반 히트테스트가 jsdom에서 불안정하므로 fireEvent로 직접 클릭한다.
    fireEvent.click(screen.getByText("Copy"));

    expect(writeText).toHaveBeenCalledWith("다음 항목을 정리해줘");
    expect(await screen.findByText("Copied")).toBeInTheDocument();
  });

  it("entry가 바뀌면 활성 썸네일 인덱스가 0으로 리셋된다", async () => {
    const user = userEvent.setup();
    const multiImageEntry = createEntry({
      previewImages: [
        "/results/award-014/thumbnail1.png",
        "/results/award-014/thumbnail2.png",
      ],
    });
    const { container, rerender } = render(
      <PromptDetailPanel entry={multiImageEntry} onClose={vi.fn()} />,
    );

    const getThumbButtons = () =>
      container.querySelectorAll(".absolute.bottom-2.left-2 button");

    await user.click(getThumbButtons()[1]);
    expect(getThumbButtons()[1].className).toContain("ring-on-dark/60");

    const otherEntry = createEntry({
      id: "award-014",
      title: "다른 항목",
      previewImages: [
        "/results/award-014/thumbnail1.png",
        "/results/award-014/thumbnail2.png",
      ],
    });
    rerender(<PromptDetailPanel entry={otherEntry} onClose={vi.fn()} />);

    expect(getThumbButtons()[0].className).toContain("ring-on-dark/60");
  });
});
