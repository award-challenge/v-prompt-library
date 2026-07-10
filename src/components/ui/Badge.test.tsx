import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("children을 렌더링한다", () => {
    render(<Badge variant="tag">업무 관리</Badge>);
    expect(screen.getByText("업무 관리")).toBeInTheDocument();
  });

  it("variant='tool'일 때 Bot 아이콘이 함께 렌더링된다", () => {
    render(<Badge variant="tool">Claude</Badge>);
    const badge = screen.getByText("Claude").closest("span");
    expect(badge?.querySelector("svg")).toBeInTheDocument();
  });

  it("award variant는 대응하는 아이콘을 렌더링한다", () => {
    render(
      <Badge variant="award" value="Best">
        Best
      </Badge>,
    );
    const badge = screen.getByText("Best").closest("span");
    expect(badge?.querySelector("svg")).toBeInTheDocument();
  });

  it("알 수 없는 award 값은 기본 스타일로 폴백한다", () => {
    render(
      <Badge variant="award" value="알수없음">
        알수없음
      </Badge>,
    );
    const badge = screen.getByText("알수없음").closest("span");
    expect(badge?.className).toContain("bg-surface-card");
  });

  it("bordered=false면 border-0 클래스가 적용된다", () => {
    render(
      <Badge variant="tag" bordered={false}>
        No Border
      </Badge>,
    );
    const badge = screen.getByText("No Border").closest("span");
    expect(badge?.className).toContain("border-0");
  });
});
