import React from "react";
import { render } from "@testing-library/react";
import PDFGenerator from "@/components/PDFGenerator";
import { vi, describe, beforeEach, it, expect } from "vitest";

// Mock the @react-pdf/renderer components
vi.mock("@react-pdf/renderer", () => ({
  Document: vi.fn(({ children }) => (
    <div data-testid="pdf-document">{children}</div>
  )),
  Page: vi.fn(({ children }) => <div data-testid="pdf-page">{children}</div>),
  Text: vi.fn(({ children }) => <span data-testid="pdf-text">{children}</span>),
  View: vi.fn(({ children }) => <div data-testid="pdf-view">{children}</div>),
  StyleSheet: {
    create: vi.fn(() => ({})),
  },
  Font: {
    register: vi.fn(),
  },
}));

describe("PDFGenerator Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders null when no feedback is provided", () => {
    const { container } = render(<PDFGenerator feedback="" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders a PDF document when feedback is provided", () => {
    const feedback = "# Test Feedback\nThis is a test.";
    const { getByTestId } = render(<PDFGenerator feedback={feedback} />);

    expect(getByTestId("pdf-document")).toBeInTheDocument();
    expect(getByTestId("pdf-page")).toBeInTheDocument();
    expect(getByTestId("pdf-view")).toBeInTheDocument();
  });

  it("renders markdown content correctly", () => {
    const feedback =
      "# Heading 1\n## Heading 2\nParagraph text\n- List item 1\n- List item 2";
    const { getAllByTestId } = render(<PDFGenerator feedback={feedback} />);

    const textElements = getAllByTestId("pdf-text");
    expect(textElements[0].textContent).toBe("Heading 1");
    expect(textElements[1].textContent).toBe("Heading 2");
    expect(textElements[2].textContent).toBe("Paragraph text");
    expect(textElements[3].textContent).toBe("• ");
    expect(textElements[4].textContent).toBe("List item 1");
    expect(textElements[5].textContent).toBe("• ");
    expect(textElements[6].textContent).toBe("List item 2");
  });

  it("handles complex markdown with various elements", () => {
    const complexFeedback = `
        # Main Heading
        ## Subheading
        Normal paragraph with **bold** and *italic* text.

        - List item 1
        - List item 2
          - Nested item

        1. Ordered item 1
        2. Ordered item 2

        > Blockquote text

        \`Inline code\`

        \`\`\`
        Code block
        \`\`\`

        [Link text](https://example.com)
      `;

    const { getByTestId } = render(<PDFGenerator feedback={complexFeedback} />);

    const textElement = getByTestId("pdf-text");
    expect(textElement.textContent?.includes("Main Heading")).toBeTruthy();
    expect(textElement.textContent?.includes("Subheading")).toBeTruthy();
    expect(
      textElement.textContent?.includes("Normal paragraph with")
    ).toBeTruthy();
    expect(textElement.textContent?.includes("- ")).toBeTruthy();
    expect(textElement.textContent?.includes("List item 1")).toBeTruthy();
    expect(textElement.textContent?.includes("1. ")).toBeTruthy();
    expect(textElement.textContent?.includes("Ordered item 1")).toBeTruthy();
    expect(textElement.textContent?.includes("Blockquote text")).toBeTruthy();
    expect(textElement.textContent?.includes("Inline code")).toBeTruthy();
    expect(textElement.textContent?.includes("Code block")).toBeTruthy();
    expect(textElement.textContent?.includes("Link text")).toBeTruthy();
  });
});
