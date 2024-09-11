"use client";

import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import TextFeedback from "@/components/TextFeedback";

describe("TextFeedback Component", () => {
  const mockRequestCVFeedback = vi.fn(async () => {});

  it("renders the component with button disabled when no file is uploaded", () => {
    render(
      <TextFeedback
        feedback=""
        requestCVFeedback={mockRequestCVFeedback}
        file={undefined}
      />
    );
    // getByText returns an span element making impossible to text the disable property of the button
    const buttonElement = screen.getByRole("button", { name: /get feedback/i });
    expect(buttonElement).toBeDisabled();
  });

  it("renders the component with button enabled when a file is uploaded", () => {
    render(
      <TextFeedback
        feedback=""
        requestCVFeedback={mockRequestCVFeedback}
        // @ts-expect-error: using File just for testing purposes is fine here
        file={new File(["(⌐□_□)"], "resume.pdf", { type: "application/pdf" })}
      />
    );
    const buttonElement = screen.getByRole("button", { name: /get feedback/i });
    expect(buttonElement).toBeEnabled();
  });

  it("calls requestCVFeedback function and displays feedback when a file is uploaded and button is clicked", async () => {
    const mockFeedback = "This is some feedback";
    const mockRequestCVFeedback = vi.fn(async () => {});

    render(
      <TextFeedback
        feedback={mockFeedback}
        requestCVFeedback={mockRequestCVFeedback}
        // @ts-expect-error: any
        file={new File(["(⌐□_□)"], "resume.pdf", { type: "image/png" })}
      />
    );
    const buttonElement = screen.getByRole("button", { name: /get feedback/i });

    await act(async () => {
      fireEvent.click(buttonElement);
    });

    expect(mockRequestCVFeedback).toHaveBeenCalled();
    // Assertions to check if loading state is shown and then hidden
    expect(screen.queryByText("This is some feedback")).toBeInTheDocument();
  });
});
