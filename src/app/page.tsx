"use client";
import { useState } from "react";

import { RcFile } from "antd/es/upload";
import { message } from "antd";

import { useCVStorage } from "@/app/hooks/useCVStorage";
import { extractCVData, requestCVFeedback } from "@/app/actions/LLM";
import { PDFUploader } from "@/components/PDFUploader";
import TextFeedback from "@/components/TextFeedback";
import VisualCV from "@/components/VisualCV";

export default function Home() {
  const [file, setFile] = useState<RcFile | undefined>();

  const { feedback, cvData, updateStorage } = useCVStorage();

  async function handleRequestCVFeedback(formData: FormData) {
    try {
      const { feedback } = await requestCVFeedback(formData);
      updateStorage({ feedback });

      if (file && feedback) {
        const extractedData = await extractCVData(feedback, await file.text());
        updateStorage({ cvData: extractedData });
      }
    } catch (error) {
      console.error("Error in handleRequestCVFeedback:", error);
      message.error(
        "There was a problem on your request, try again in a few seconds!"
      );
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">AI Resume Coach</h1>
        <div className="p-4 max-w-2xl mx-auto">
          <PDFUploader handleFile={setFile} />
          <TextFeedback
            feedback={feedback}
            requestCVFeedback={handleRequestCVFeedback}
            file={file}
          />
          {cvData && <VisualCV cvData={cvData} />}
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-gray-500">
        Made with{" "}
        <span className="text-red-500 hover:text-red-600 transition-colors duration-300">
          ❤
        </span>{" "}
        by{" "}
        <a
          href="https://luillyfe.medium.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-700 transition-colors duration-300"
        >
          Fermin Blanco
        </a>
      </footer>
    </div>
  );
}
