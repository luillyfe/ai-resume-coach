import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendMessage, uploadFile } from "@/app/LLM/CVReviewerClient";

// Mock the global fetch function
global.fetch = vi.fn();

describe("CV Processor Module", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Mock console.error to prevent error logging during tests
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("sendMessage", () => {
    it("should send a message and return the response", async () => {
      const mockResponse = "Mocked API response";
      // @ts-expect-error: Property 'mockResolvedValueOnce' does exist on type
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockResponse),
      });

      const result = await sendMessage("Test prompt", "test-file-uri");

      expect(result).toBe(mockResponse);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("https://generativelanguage.googleapis.com"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: expect.stringContaining("Test prompt"),
        })
      );
    });

    it("should handle network errors", async () => {
      // @ts-expect-error: Property 'mockResolvedValueOnce' does exist on type
      global.fetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(sendMessage("Test prompt", "test-file-uri")).resolves.toBe(
        ""
      );
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should handle non-ok responses", async () => {
      // @ts-expect-error: Property 'mockResolvedValueOnce' does exist on type
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
      });

      await expect(sendMessage("Test prompt", "test-file-uri")).resolves.toBe(
        ""
      );
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("uploadFile", () => {
    it("should upload a file and return the file URI", async () => {
      const mockFileUri = "mocked-file-uri";
      // @ts-expect-error: Property 'mockResolvedValueOnce' does exist on type
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ file: { uri: mockFileUri } }),
      });

      const mockFile = new File(["test content"], "test.pdf", {
        type: "application/pdf",
      });
      const result = await uploadFile(mockFile);

      expect(result).toBe(mockFileUri);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          "https://generativelanguage.googleapis.com/upload"
        ),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "X-Goog-Upload-Command": "upload, finalize",
            "X-Goog-Upload-Protocol": "raw",
            "Content-Type": "application/pdf",
          }),
          body: mockFile,
        })
      );
    });

    it("should handle upload errors", async () => {
      // @ts-expect-error: Property 'mockResolvedValueOnce' does exist on type
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      const mockFile = new File(["test content"], "test.pdf", {
        type: "application/pdf",
      });
      await expect(uploadFile(mockFile)).rejects.toThrow(
        "Upload failed: 500 Internal Server Error"
      );
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});
