import React, { useState } from "react";
import { Button, Spin, Tabs, message } from "antd";
import { RcFile } from "antd/es/upload";
import { PDFDownloadLink } from "@react-pdf/renderer";

import {
  extractCVData,
  requestCVFeedback,
  sendFileToLLM,
} from "@/app/actions/LLM";
import { useCVStorage } from "@/app/hooks/useCVStorage";

import PDFGenerator from "@/components/PDFGenerator";
import CVFeedback from "@/components/CVFeedback";
import CVInsights from "@/components/CVInsights";

import "./index.css";

/**
 * Props for the CVAnalyzer component.
 */
interface CVAnalyzerProps {
  /** The uploaded CV file. */
  file: RcFile | undefined;
}

/**
 * CVAnalyzer component provides functionality to analyze a CV, get feedback,
 * and display insights.
 *
 * @component
 * @param {CVAnalyzerProps} props - The component props.
 * @returns {React.ReactElement} The rendered CVAnalyzer component.
 */
const CVAnalyzer: React.FC<CVAnalyzerProps> = ({ file }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { feedback, cvData, updateStorage } = useCVStorage();

  /**
   * Handles the CV feedback request process.
   *
   * @async
   * @param {FormData} formData - The form data containing the CV file.
   * @throws {Error} If there's an issue with the request or processing.
   */
  const handleRequestCVFeedback = async (formData: FormData) => {
    try {
      const fileUri = await sendFileToLLM(formData);
      const { feedback } = await requestCVFeedback(fileUri);
      updateStorage({ feedback });

      if (fileUri && feedback) {
        const extractedData = await extractCVData(fileUri, feedback);
        updateStorage({ cvData: extractedData });
      }
    } catch (error) {
      console.error("Error in handleRequestCVFeedback:", error);
      message.error(
        "There was a problem with your request. Please try again in a few seconds."
      );
    }
  };

  /**
   * Initiates the process of getting feedback for the uploaded CV.
   *
   * @async
   * @param {React.MouseEvent} event - The click event.
   */
  const getFeedback = async (event: React.MouseEvent) => {
    event.preventDefault();

    if (!file) {
      message.error("Please upload a CV first");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("cv", file);
      await handleRequestCVFeedback(formData);
    } catch (error) {
      console.error("Error requesting CV feedback:", error);
      message.error("Failed to get feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const items = [
    {
      label: "Feedback",
      key: "Feedback",
      children: <CVFeedback feedback={feedback} styles="cv-feedback" />,
    },
    {
      label: "Insights",
      key: "Insights",
      children: cvData && <CVInsights cvData={cvData} styles="cv-insights" />,
    },
  ];

  return (
    <div className="cv-analyzer">
      <div className="cv-analyzer__actions">
        <Button
          onClick={getFeedback}
          disabled={!file || isLoading}
          className="cv-analyzer__action-button"
        >
          Get Feedback
        </Button>

        {isLoading && (
          <Spin className="cv-analyzer__loading-spinner" data-testid="status" />
        )}

        {feedback && (
          <PDFDownloadLink
            document={<PDFGenerator feedback={feedback} />}
            fileName="cv_feedback.pdf"
          >
            {({ loading }) => (
              <Button disabled={loading} className="cv-analyzer__action-button">
                {loading ? "Preparing PDF..." : "Download PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        )}
      </div>

      {feedback && (
        <Tabs
          items={items}
          defaultActiveKey="feedback"
          className="cv-analyzer__results"
        />
      )}
    </div>
  );
};

export default CVAnalyzer;
