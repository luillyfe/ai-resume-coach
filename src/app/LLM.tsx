"use server";
import { NextResponse } from "next/server";
// @ts-expect-error: no types were found on registry
import pdf from "pdf-parse-debugging-disabled";

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

// Server Function
export async function sendMessage(formData: FormData): Promise<string> {
  const fileContent = await parsePDF(formData);

  const prompt = `
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
  
        Here's the CV content:
  
        ${fileContent}
      `;

  const geminiData = await fetchGeminiData(prompt);
  return formatGeminiOutput(geminiData);
}

const API_KEY = process.env.GEMINI_API_KEY;
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-exp-0827:generateContent?key=${API_KEY}`;

async function fetchGeminiData(userInput: string) {
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

const formatGeminiOutput = async (textOutput: string) => {
  const respJson = JSON.parse(textOutput);
  return respJson.candidates[0].content.parts[0].text;
};

interface File {
  type: string;
  arrayBuffer: () => Promise<ArrayBuffer>;
}

async function parsePDF(formData: FormData) {
  const file = formData.get("cv") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Check if the file is a PDF
  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Uploaded file must be a PDF" },
      { status: 400 }
    );
  }

  // Convert file to ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Extract text from PDF
  const data = await pdf(arrayBuffer);
  return data.text;
}
