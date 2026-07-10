import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("기본 텍스트를 렌더링한다", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" }),
    ).toBeInTheDocument();
  });

  it("클릭 시 onClick이 호출된다", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);

    await user.click(screen.getByRole("button", { name: "Click me" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disabled일 때 클릭해도 onClick이 호출되지 않는다", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Click me
      </Button>,
    );

    await user.click(screen.getByRole("button", { name: "Click me" }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("variant/size에 따라 다른 클래스가 적용된다", () => {
    render(
      <Button variant="ghost" size="sm">
        Ghost
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Ghost" });
    expect(button.className).toContain("text-muted");
    expect(button.className).toContain("text-sm");
  });
});
