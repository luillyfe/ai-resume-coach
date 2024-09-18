import { describe, expect, it, vi } from "vitest";
import { CVData, sendMessage } from "@/app/LLM/CVReviewerClient";
import { requestCVFeedback, extractCVData } from "@/app/actions/CVActions";

// Mock the LLMClient module
vi.mock("@/app/LLM/CVReviewerClient", () => ({
  sendMessage: vi.fn(),
}));

// Mock the PDFUtils module
vi.mock("@/lib/PDFUtils", () => ({
  parsePDF: vi.fn(),
}));

describe("LLM Actions", () => {
  describe("requestCVFeedback", () => {
    it("should send the correct prompt to the LLM and return the formatted feedback", async () => {
      const mockFileUri = "test-file-uri";
      const mockGeminiResponse = JSON.stringify({
        candidates: [
          {
            content: { parts: [{ text: "json" }] },
          },
        ],
      });

      // Set up mock implementations
      vi.mocked(sendMessage).mockResolvedValue(mockGeminiResponse);

      const response = await requestCVFeedback(mockFileUri);

      expect(sendMessage).toHaveBeenCalled();
      expect(response.feedback).toBe("json");
    });
  });

  describe("extractCVData", () => {
    it("should send the correct extraction prompt to the LLM and return the parsed CV data", async () => {
      const mockFeedback = "Some feedback about the CV";
      const mockFileUri = "test-file-uri";
      const mockStructuredDataResponse = JSON.stringify({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    name: "John Doe",
                    title: "",
                    summary: "",
                    experience: [],
                    skills: [],
                    education: [],
                    achievements: [],
                  }),
                },
              ],
            },
          },
        ],
      });
      const expectedCVData: CVData = {
        name: "John Doe",
        title: "",
        summary: "",
        experience: [],
        skills: [],
        education: [],
        achievements: [],
      };

      vi.mocked(sendMessage).mockResolvedValue(mockStructuredDataResponse);

      const cvData = await extractCVData(mockFileUri, mockFeedback);

      // Let's check for both the feedback and the original CV content in a single string argument.
      expect(sendMessage).toHaveBeenCalledWith(
        expect.stringContaining(mockFeedback),
        expect.stringContaining(mockFileUri)
      );
      expect(cvData).toEqual(expectedCVData);
    });

    it("should handle errors during JSON parsing and return a default CVData object", async () => {
      const mockFeedback = "Some feedback";
      const mockOriginalCV = "Original CV";
      const mockStructuredDataResponse = JSON.stringify({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: {
                    name: "John Doe",
                    title: "",
                    summary: "",
                    experience: [],
                    skills: [],
                    education: [],
                    achievements: [],
                  },
                },
              ],
            },
          },
        ],
      });
      const defaultCVData: CVData = {
        name: "",
        title: "",
        summary: "",
        experience: [],
        skills: [],
        education: [],
        achievements: [],
      };

      vi.mocked(sendMessage).mockResolvedValue(mockStructuredDataResponse);

      // Temporarily suppress console.error
      const originalConsoleError = console.error;
      console.error = vi.fn();

      const cvData = await extractCVData(mockFeedback, mockOriginalCV);

      // Restore console.error
      console.error = originalConsoleError;

      expect(sendMessage).toHaveBeenCalledWith(
        expect.stringContaining(mockOriginalCV),
        expect.stringContaining(mockFeedback)
      );
      expect(cvData).toEqual(defaultCVData);
    });
  });
});
