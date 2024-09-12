"use client";
import { ChangeEvent } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { PDFUploader } from "@/components/PDFUploader";

// Mock the antd Upload component
vi.mock("antd", async () => {
  const actual = await vi.importActual("antd");
  return {
    ...actual,
    // Mocking Upload is a need since `handleFile` is only called when the status is `done`.
    // This status change in the behavior of the Ant Design `Upload` component is being mocked
    // to simulate a successful upload.
    Upload: {
      Dragger: ({ onChange }: { onChange: ({}) => void }) => {
        return (
          <input
            type="file"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange({
                // @ts-expect-error: possible null value
                file: { status: "done", originFileObj: e.target.files[0] },
              })
            }
          />
        );
      },
    },
  };
});

describe("PDFUploader component", () => {
  it("calls handleFile with the uploaded file when a PDF is uploaded", async () => {
    const handleFile = vi.fn();
    const file = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });

    const { container } = render(<PDFUploader handleFile={handleFile} />);
    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    await waitFor(() => {
      fireEvent.change(input, {
        target: { files: [file] },
      });
    });

    expect(handleFile).toHaveBeenCalledWith(expect.any(File));
  });
});
