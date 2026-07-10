import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImageLightbox } from "./ImageLightbox";

const IMAGES = ["/results/award-008/result.png"];
const MULTI_IMAGES = [
  "/results/award-014/thumbnail1.png",
  "/results/award-014/thumbnail2.png",
  "/results/award-014/thumbnail3.png",
];

describe("ImageLightbox", () => {
  it("isOpen=false면 아무것도 렌더링하지 않는다", () => {
    render(
      <ImageLightbox
        images={IMAGES}
        initialIndex={0}
        isOpen={false}
        onClose={vi.fn()}
      />,
    );
    expect(screen.queryByLabelText("닫기")).not.toBeInTheDocument();
  });

  it("isOpen=true면 닫기 버튼과 하단 썸네일이 보인다 (이미지 1장이어도)", () => {
    render(
      <ImageLightbox
        images={IMAGES}
        initialIndex={0}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByLabelText("닫기")).toBeInTheDocument();
    expect(screen.getByLabelText("1번째 이미지")).toBeInTheDocument();
  });

  it("이미지가 1장이면 이전/다음 버튼과 카운터가 없다", () => {
    render(
      <ImageLightbox
        images={IMAGES}
        initialIndex={0}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );
    expect(screen.queryByLabelText("이전 이미지")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("다음 이미지")).not.toBeInTheDocument();
  });

  it("이미지가 여러 장이면 카운터와 이전/다음 버튼이 보인다", () => {
    render(
      <ImageLightbox
        images={MULTI_IMAGES}
        initialIndex={0}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
    expect(screen.getByLabelText("이전 이미지")).toBeInTheDocument();
    expect(screen.getByLabelText("다음 이미지")).toBeInTheDocument();
  });

  it("닫기 버튼 클릭 시 onClose가 호출된다", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <ImageLightbox
        images={IMAGES}
        initialIndex={0}
        isOpen={true}
        onClose={onClose}
      />,
    );

    await user.click(screen.getByLabelText("닫기"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("다음 이미지 버튼 클릭 시 카운터가 증가한다", async () => {
    const user = userEvent.setup();
    render(
      <ImageLightbox
        images={MULTI_IMAGES}
        initialIndex={0}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    await user.click(screen.getByLabelText("다음 이미지"));

    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("Escape 키를 누르면 onClose가 호출된다", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <ImageLightbox
        images={IMAGES}
        initialIndex={0}
        isOpen={true}
        onClose={onClose}
      />,
    );

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
