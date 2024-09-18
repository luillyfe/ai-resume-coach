import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import CVAnalyzer from "@/components/CVAnalyzer";
import { useCVStorage } from "@/app/hooks/useCVStorage";
import {
  sendFileToLLM,
  requestCVFeedback,
  extractCVData,
} from "@/app/actions/CVActions";

import { RcFile } from "antd/es/upload";

// Mock the external dependencies
vi.mock("@/app/hooks/useCVStorage");
vi.mock("@/app/actions/CVActions", () => ({
  sendFileToLLM: vi.fn(),
  requestCVFeedback: vi.fn().mockReturnValue({ feedback: "" }),
  extractCVData: vi.fn(),
}));
vi.mock("@react-pdf/renderer", async () => {
  const actual = await vi.importActual("@react-pdf/renderer");
  return {
    ...actual,
    PDFDownloadLink: ({ children }: { children: React.FC }) =>
      children({ loading: false }),
  };
});

describe("CVAnalyzer", () => {
  const mockFile = new File(["dummy content"], "test.pdf", {
    type: "application/pdf",
  }) as RcFile;

  beforeEach(() => {
    vi.mock("@/app/hooks/useCVStorage", () => ({
      useCVStorage: vi.fn().mockReturnValue({
        feedback: "",
        cvData: null,
        updateStorage: vi.fn(),
      }),
    }));
  });

  it("renders without crashing", () => {
    render(<CVAnalyzer file={mockFile} />);

    expect(
      screen.getByRole("button", { name: /get feedback/i })
    ).toBeInTheDocument();
  });

  it("disables the Get Feedback button when no file is provided", () => {
    render(<CVAnalyzer file={undefined} />);
    expect(
      screen.getByRole("button", { name: /get feedback/i })
    ).toBeDisabled();
  });

  it("enables the Get Feedback button when a file is provided", () => {
    render(<CVAnalyzer file={mockFile} />);
    expect(screen.getByRole("button", { name: /get feedback/i })).toBeEnabled();
  });

  it("shows loading spinner when getting feedback", async () => {
    render(<CVAnalyzer file={mockFile} />);

    fireEvent.click(screen.getByRole("button", { name: /get feedback/i }));

    await waitFor(() => {
      expect(screen.getByTestId("status")).toBeInTheDocument();
    });
  });

  it("calls the necessary functions and updates storage when getting feedback", async () => {
    const mockFeedback = "Great CV!";
    const mockCVData = {
      name: "John Doe",
      skills: [
        { skill: "React", proficiency: 9 },
        { skill: "TypeScript", proficiency: 7 },
      ],
      title: "",
      summary: "",
      experience: [],
      education: [],
      achievements: [],
    };

    vi.mocked(sendFileToLLM).mockResolvedValue("file-uri");
    vi.mocked(requestCVFeedback).mockResolvedValue({
      feedback: mockFeedback,
    });
    vi.mocked(extractCVData).mockResolvedValue(mockCVData);

    render(<CVAnalyzer file={mockFile} />);
    fireEvent.click(screen.getByText("Get Feedback"));

    await waitFor(() => {
      expect(sendFileToLLM).toHaveBeenCalled();
      expect(requestCVFeedback).toHaveBeenCalledWith("file-uri");
      expect(extractCVData).toHaveBeenCalledWith("file-uri", mockFeedback);
    });
  });

  it("displays feedback and insights tabs when feedback is available", async () => {
    vi.mocked(useCVStorage).mockReturnValue({
      feedback: "Great CV!",
      cvData: {
        name: "John Doe",
        skills: [
          { skill: "React", proficiency: 9 },
          { skill: "TypeScript", proficiency: 7 },
        ],
        title: "",
        summary: "",
        experience: [],
        education: [],
        achievements: [],
      },
      updateStorage: () => null,
      clearStorage: () => null,
    });

    render(<CVAnalyzer file={mockFile} />);

    expect(screen.getByText("Feedback")).toBeInTheDocument();
    expect(screen.getByText("Insights")).toBeInTheDocument();
  });

  it("shows error message when feedback request fails", async () => {
    vi.spyOn(console, "error").mockImplementationOnce(() => null);
    vi.mocked(sendFileToLLM).mockRejectedValue(new Error("API Error"));

    render(<CVAnalyzer file={mockFile} />);
    fireEvent.click(screen.getByText("Get Feedback"));

    await waitFor(() => {
      expect(
        screen.getByText(
          "There was a problem with your request. Please try again in a few seconds."
        )
      ).toBeInTheDocument();
    });
  });

  it("renders Download PDF button when feedback is available", async () => {
    vi.mocked(useCVStorage).mockReturnValue({
      feedback: "Great CV!",
      cvData: null,
      updateStorage: () => null,
      clearStorage: () => null,
    });

    render(<CVAnalyzer file={mockFile} />);

    expect(screen.getByText("Download PDF")).toBeInTheDocument();
  });
});
