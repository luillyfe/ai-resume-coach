import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CVFeedback from "@/components/CVFeedback";

// Mock the ReactMarkdown component
vi.mock("react-markdown", () => ({
  default: ({ children }: { children: string }) => (
    <div data-testid="markdown">{children}</div>
  ),
}));

// Mock the remark-gfm plugin
vi.mock("remark-gfm", () => ({
  default: vi.fn(),
}));

describe("CVFeedback", () => {
  const mockFeedback = "# Feedback This is some test feedback.";
  const mockStyles = "test-style";

  it("renders without crashing", () => {
    render(<CVFeedback feedback={mockFeedback} styles={mockStyles} />);
    expect(screen.getByTestId("markdown")).toBeInTheDocument();
  });

  it("displays the feedback text", () => {
    render(<CVFeedback feedback={mockFeedback} styles={mockStyles} />);
    expect(screen.getByTestId("markdown")).toHaveTextContent(mockFeedback);
  });

  it("applies the provided styles", () => {
    render(<CVFeedback feedback={mockFeedback} styles={mockStyles} />);
    const card = screen.getByTestId("article");
    expect(card).toHaveClass(mockStyles);
    expect(card).toHaveClass("mb-4");
  });

  it("renders the Card title correctly", () => {
    render(<CVFeedback feedback={mockFeedback} styles={mockStyles} />);
    expect(screen.getByText("CV Feedback")).toBeInTheDocument();
  });

  it("does not render anything when feedback is an empty string", () => {
    const { container } = render(
      <CVFeedback feedback="" styles={mockStyles} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("the ReactMarkdown component is on the document", () => {
    render(<CVFeedback feedback={mockFeedback} styles={mockStyles} />);
    const markdown = screen.getByTestId("markdown");
    expect(markdown).toBeInTheDocument();
  });
});
