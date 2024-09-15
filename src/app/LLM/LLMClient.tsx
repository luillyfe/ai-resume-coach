"use server";

// Define the CV data schema
export interface CVData {
  name: string;
  title: string;
  summary: string;
  experience: Array<{
    position: string;
    company: string;
    duration: string;
    responsibilities: string[];
  }>;
  skills: Array<{
    skill: string;
    proficiency: number;
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
  achievements: string[];
}

const API_KEY = process.env.GEMINI_API_KEY;
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-exp-0827:generateContent?key=${API_KEY}`;

export async function sendMessage(
  prompt: string,
  fileUri: string
): Promise<string> {
  const requestBody = {
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
      body: JSON.stringify(requestBody), // Stringify the request body
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.text(); // Response is plain text
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return "";
  }
}

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
