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

export async function sendMessage(userInput: string): Promise<string> {
  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: userInput, // The user input
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
