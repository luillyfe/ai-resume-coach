import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TextFeedback from "@/components/TextFeedback";
import { RcFile } from "antd/es/upload";

// Mock the external dependencies
vi.mock("antd", async () => {
  const actual = await vi.importActual("antd");
  return {
    ...actual,
    message: {
      error: vi.fn(),
    },
  };
});

vi.mock("@react-pdf/renderer", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PDFDownloadLink: ({ children }: { children: any }) =>
    children({ loading: false }),
}));

vi.mock("@/components/PDFGenerator", () => ({
  default: () => <div>PDF Generator Mock</div>,
}));

describe("TextFeedback Component", () => {
  const mockRequestCVFeedback = vi.fn();
  const mockFile = { name: "test.pdf" } as unknown as RcFile;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the component with initial state", () => {
    render(
      <TextFeedback
        feedback=""
        requestCVFeedback={mockRequestCVFeedback}
        file={undefined}
      />
    );

    // `getByText` returns an span element making impossible to test the disable property of a button. So we are using `getByRole` instead.
    const getFeedbackBtn = screen.getByRole("button", {
      name: /get feedback/i,
    });

    expect(getFeedbackBtn).toBeInTheDocument();
    expect(getFeedbackBtn).toBeDisabled();
    expect(screen.queryByText("CV Feedback")).not.toBeInTheDocument();
  });

  it('enables the "Get Feedback" button when a file is provided', () => {
    render(
      <TextFeedback
        feedback=""
        requestCVFeedback={mockRequestCVFeedback}
        file={mockFile}
      />
    );

    const getFeedbackBtn = screen.getByRole("button", {
      name: /get feedback/i,
    });

    expect(getFeedbackBtn).toBeEnabled();
  });

  it('calls requestCVFeedback when "Get Feedback" is clicked with a file', async () => {
    render(
      <TextFeedback
        feedback=""
        requestCVFeedback={mockRequestCVFeedback}
        file={mockFile}
      />
    );

    const getFeedbackBtn = screen.getByRole("button", {
      name: /get feedback/i,
    });

    fireEvent.click(getFeedbackBtn);

    await waitFor(() => {
      expect(mockRequestCVFeedback).toHaveBeenCalled();
    });
  });

  it("displays feedback when provided", () => {
    const testFeedback = "This is test feedback";
    render(
      <TextFeedback
        feedback={testFeedback}
        requestCVFeedback={mockRequestCVFeedback}
        file={mockFile}
      />
    );

    expect(screen.getByText("CV Feedback")).toBeInTheDocument();
    expect(screen.getByText(testFeedback)).toBeInTheDocument();
  });

  it("renders the PDF download link when feedback is available", () => {
    render(
      <TextFeedback
        feedback="Some feedback"
        requestCVFeedback={mockRequestCVFeedback}
        file={mockFile}
      />
    );

    expect(screen.getByText("Download PDF")).toBeInTheDocument();
  });

  it("shows loading state when requesting feedback", async () => {
    mockRequestCVFeedback.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <TextFeedback
        feedback=""
        requestCVFeedback={mockRequestCVFeedback}
        file={mockFile}
      />
    );

    const getFeedbackBtn = screen.getByRole("button", {
      name: /get feedback/i,
    });

    fireEvent.click(getFeedbackBtn);

    expect(
      await screen.findByRole("button", {
        name: /get feedback/i,
      })
    ).toBeDisabled();

    await waitFor(() => {
      expect(getFeedbackBtn).toBeEnabled();
    });
  });
});
