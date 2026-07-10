import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { StarRating } from "./StarRating";

describe("StarRating", () => {
  it("항상 5개의 별 아이콘을 렌더링한다", () => {
    const { container } = render(<StarRating filled={3} />);
    expect(container.querySelectorAll("svg").length).toBe(5);
  });

  it("filled 개수만큼 채워진 별에 fill-warning 클래스가 적용된다", () => {
    const { container } = render(<StarRating filled={2} />);
    const stars = Array.from(container.querySelectorAll("svg"));
    const filledStars = stars.filter((s) =>
      s.getAttribute("class")?.includes("fill-warning"),
    );
    expect(filledStars).toHaveLength(2);
  });

  it("filled=0이면 채워진 별이 없다", () => {
    const { container } = render(<StarRating filled={0} />);
    const stars = Array.from(container.querySelectorAll("svg"));
    const filledStars = stars.filter((s) =>
      s.getAttribute("class")?.includes("fill-warning"),
    );
    expect(filledStars).toHaveLength(0);
  });

  it("size prop이 svg 크기에 반영된다", () => {
    const { container } = render(<StarRating filled={1} size={24} />);
    const firstStar = container.querySelector("svg");
    expect(firstStar).toHaveAttribute("width", "24");
    expect(firstStar).toHaveAttribute("height", "24");
  });
});
