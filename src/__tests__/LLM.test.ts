import { describe, expect, it, vi } from "vitest";
import { CVData } from "@/app/LLM/LLMClient";
import { requestCVFeedback, extractCVData } from "@/app/actions/LLM";
import { parsePDF } from "@/lib/PDFUtils";
import { sendMessage } from "@/app/LLM/LLMClient";

// Mock the LLMClient module
vi.mock("@/app/LLM/LLMClient", () => ({
  sendMessage: vi.fn(),
}));

// Mock the PDFUtils module
vi.mock("@/lib/PDFUtils", () => ({
  parsePDF: vi.fn(),
}));

// Mock the LLMUtils module
vi.mock("@/lib/LLMUtils", () => ({
  formatGeminiOutput: vi.fn((args) => args.response.candidates[0].content),
}));

describe("LLM Actions", () => {
  describe("requestCVFeedback", () => {
    it("should send the correct prompt to the LLM and return the formatted feedback", async () => {
      const mockFormData = new FormData();
      const mockFileContent = "This is a mock CV content.";
      const mockGeminiResponse = {
        response: {
          candidates: [
            {
              content: `{ "some": "json" }`,
            },
          ],
        },
      };

      // Set up mock implementations
      vi.mocked(parsePDF).mockResolvedValue(mockFileContent);
      // @ts-expect-error: expect string
      vi.mocked(sendMessage).mockResolvedValue(mockGeminiResponse);

      const response = await requestCVFeedback(mockFormData);

      expect(parsePDF).toHaveBeenCalledWith(mockFormData);
      expect(sendMessage).toHaveBeenCalledWith(
        expect.stringContaining(mockFileContent)
      );
      expect(response.feedback).toBe(`{ "some": "json" }`);
    });
  });

  describe("extractCVData", () => {
    it("should send the correct extraction prompt to the LLM and return the parsed CV data", async () => {
      const mockFeedback = "Some feedback about the CV";
      const mockOriginalCV = "Original CV content";
      const mockStructuredDataResponse = {
        response: {
          candidates: [
            {
              content:
                '{ "name": "John Doe", "title": "", "summary": "", "experience": [], "skills": [], "education": [], "achievements": [] }',
            },
          ],
        },
      };
      const expectedCVData: CVData = {
        name: "John Doe",
        title: "",
        summary: "",
        experience: [],
        skills: [],
        education: [],
        achievements: [],
      };

      // @ts-expect-error: expect string
      vi.mocked(sendMessage).mockResolvedValue(mockStructuredDataResponse);

      const cvData = await extractCVData(mockFeedback, mockOriginalCV);

      // Let's check for both the feedback and the original CV content in a single string argument.
      expect(sendMessage).toHaveBeenCalledWith(
        expect.stringContaining(mockFeedback) &&
          expect.stringContaining(mockOriginalCV)
      );
      expect(cvData).toEqual(expectedCVData);
    });

    it("should handle errors during JSON parsing and return a default CVData object", async () => {
      const mockFeedback = "Some feedback";
      const mockOriginalCV = "Original CV";
      const mockStructuredDataResponse = {
        response: {
          candidates: [
            {
              content: "```json\nInvalid JSON\n```",
            },
          ],
        },
      };
      const defaultCVData: CVData = {
        name: "",
        title: "",
        summary: "",
        experience: [],
        skills: [],
        education: [],
        achievements: [],
      };

      // @ts-expect-error: expect string
      vi.mocked(sendMessage).mockResolvedValue(mockStructuredDataResponse);

      // Temporarily suppress console.error
      const originalConsoleError = console.error;
      console.error = vi.fn();

      const cvData = await extractCVData(mockFeedback, mockOriginalCV);

      // Restore console.error
      console.error = originalConsoleError;

      expect(sendMessage).toHaveBeenCalledWith(
        expect.stringContaining(mockFeedback) &&
          expect.stringContaining(mockOriginalCV)
      );
      expect(cvData).toEqual(defaultCVData);
    });
  });
});
