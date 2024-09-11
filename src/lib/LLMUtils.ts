// LLMUtils module contains utilities for working with LLM text formatting stuff

/**
 * Formats the output from the Gemini API into a user-friendly string.
 *
 * @param textOutput - The raw JSON string returned by the Gemini API.
 * @returns The formatted text extracted from the Gemini response.
 * @throws {Error} If the input format is invalid or if text extraction fails.
 *
 * @example
 * const geminiResponse = '{ "candidates": [{ "content": { "parts": [{ "text": "Hello, world!" }] } }] }';
 * const formattedText = formatGeminiOutput(geminiResponse); // Returns "Hello, world!"
 */
export const formatGeminiOutput = (textOutput: string): string => {
  try {
    const respJson = JSON.parse(textOutput);

    // Validate the structure of the response JSON
    if (
      !respJson.candidates ||
      !Array.isArray(respJson.candidates) ||
      respJson.candidates.length === 0
    ) {
      throw new Error(
        "Invalid response format: Missing or empty 'candidates' array."
      );
    }
    if (
      !respJson.candidates[0].content ||
      !respJson.candidates[0].content.parts ||
      !Array.isArray(respJson.candidates[0].content.parts) ||
      respJson.candidates[0].content.parts.length === 0
    ) {
      throw new Error(
        "Invalid response format: Missing or empty 'content.parts' array."
      );
    }
    if (!respJson.candidates[0].content.parts[0].text) {
      throw new Error(
        "Invalid response format: Missing 'text' field in the first part."
      );
    }

    // Extract and return the text content
    return respJson.candidates[0].content.parts[0].text;
  } catch (error) {
    // Handling the error:
    console.error("Error formatting Gemini output:", error);
    throw new Error("Failed to format Gemini output. Please check the input.");
  }
};
