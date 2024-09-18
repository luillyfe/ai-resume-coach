"use server";
/**
 * @fileoverview CV Processor Module
 *
 * This module provides functionality to interact with the Gemini AI model API
 * for processing and analyzing CV (Curriculum Vitae) data. It includes methods
 * for sending prompts along with CV files to the API and uploading files.
 *
 * @module CVProcessor
 */

/**
 * @constant {string} API_KEY - The API key for authenticating requests to the Gemini API.
 * @private
 */
const API_KEY = process.env.GEMINI_API_KEY;

/**
 * @constant {string} apiUrl - The URL endpoint for the Gemini API.
 * @private
 */
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-exp-0827:generateContent?key=${API_KEY}`;

/**
 * @constant {string} CV_REVIEW_INSTRUCTIONS - The system instructions for CV review.
 * @private
 */
const CV_REVIEW_INSTRUCTIONS = `
You are an expert CV reviewer for the tech industry. Analyze the following CV and provide detailed, actionable feedback. Focus on:
1. Overall structure and formatting
2. Professional summary
3. Work experience (including quantifiable achievements)
4. Skills section
5. Education and certifications
6. Projects or portfolio
7. Tailoring for tech roles

Provide specific suggestions for improvement and highlight any red flags. 
Format your response in markdown for easy reading.
`;

/**
 * Represents the structure of a CV (Curriculum Vitae).
 * @interface CVData
 */
export interface CVData {
  /** The full name of the CV owner */
  name: string;
  /** The professional title or position */
  title: string;
  /** A brief summary or objective statement */
  summary: string;
  /** An array of work experiences */
  experience: Array<{
    /** Job position or role */
    position: string;
    /** Name of the company or organization */
    company: string;
    /** Duration of employment */
    duration: string;
    /** List of job responsibilities or achievements */
    responsibilities: string[];
  }>;
  /** An array of skills and their proficiency levels */
  skills: Array<{
    /** Name of the skill */
    skill: string;
    /** Proficiency level (typically on a scale, e.g., 1-10) */
    proficiency: number;
  }>;
  /** An array of educational qualifications */
  education: Array<{
    /** Degree or certification obtained */
    degree: string;
    /** Name of the educational institution */
    school: string;
    /** Year of graduation or completion */
    year: string;
  }>;
  /** An array of notable achievements or awards */
  achievements: string[];
}

/**
 * Sends a message (prompt) along with a file to the Gemini API for processing.
 *
 * @async
 * @param {string} prompt - The text prompt to send to the API.
 * @param {string} fileUri - The URI of the file (CV) to be processed.
 * @returns {Promise<string>} The response from the API as a string.
 * @throws {Error} If there's a network error or the API returns a non-OK response.
 */
export async function sendMessage(
  prompt: string,
  fileUri: string
): Promise<string> {
  const requestBody = {
    systemInstruction: {
      role: "user",
      parts: [
        {
          text: CV_REVIEW_INSTRUCTIONS,
        },
      ],
    },
    contents: [
      {
        role: "user",
        parts: [
          {
            fileData: {
              fileUri,
              mimeType: "application/pdf",
            },
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 1,
      topK: 64,
      topP: 0.95,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    },
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.text();
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return "";
  }
}

/**
 * Uploads a file to the Gemini API.
 *
 * @async
 * @param {File} file - The file object to be uploaded.
 * @returns {Promise<string>} The URI of the uploaded file.
 * @throws {Error} If the upload fails or the API returns a non-OK response.
 */
export async function uploadFile(file: File): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "X-Goog-Upload-Command": "upload, finalize",
        "X-Goog-Upload-Protocol": "raw",
        "Content-Type": file.type,
      },
      body: file,
    }
  );

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.file.uri;
}
