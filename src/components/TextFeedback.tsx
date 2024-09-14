/**
 * TextFeedback Component
 *
 * This component handles the text feedback functionality for a CV (Curriculum Vitae) upload system.
 * It allows users to upload a CV file, request feedback, and view the feedback in both text and PDF formats.
 *
 * @component
 *
 * @param {object} props - The component props
 * @param {string} props.feedback - The feedback text to display
 * @param {function} props.requestCVFeedback - Function to call when requesting feedback
 * @param {RcFile | undefined} props.file - The uploaded CV file (RcFile is a type from Antd)
 *
 * @returns {JSX.Element} The rendered TextFeedback component
 *
 * @example
 * <TextFeedback
 *   feedback={feedbackText}
 *   requestCVFeedback={handleCVFeedbackRequest}
 *   file={uploadedFile}
 * />
 */

import React, { useState, MouseEvent } from "react";
import { Button, Card, Spin, message } from "antd";
import { RcFile } from "antd/es/upload";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFGenerator from "@/components/PDFGenerator";

const TextFeedback: React.FC<{
  feedback: string;
  requestCVFeedback: (userPrompt: FormData) => Promise<void>;
  file: RcFile | undefined;
}> = ({ feedback, requestCVFeedback, file }) => {
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Handles the feedback request when the "Get Feedback" button is clicked.
   *
   * @param {MouseEvent} event - The click event
   * @returns {Promise<void>}
   *
   * @throws {Error} If the CV file is not uploaded
   */
  const getFeedback = async (event: MouseEvent): Promise<void> => {
    event.stopPropagation();

    if (!file) {
      message.error("Please upload a CV first");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("cv", file);
      await requestCVFeedback(formData);
    } catch (error) {
      console.error("Error requesting CV feedback:", error);
      message.error("Failed to get feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={getFeedback}
        disabled={!file || loading}
        className="mb-4"
      >
        Get Feedback
      </Button>
      {loading && <Spin className="mb-4" />}
      {feedback && (
        <PDFDownloadLink
          document={<PDFGenerator feedback={feedback} />}
          fileName="cv_feedback.pdf"
        >
          {({ loading }) =>
            loading ? (
              "Preparing PDF..."
            ) : (
              <Button className="mb-4">Download PDF</Button>
            )
          }
        </PDFDownloadLink>
      )}
      {feedback && (
        <Card title="CV Feedback" className="mb-4">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="prose max-w-none"
          >
            {feedback}
          </ReactMarkdown>
        </Card>
      )}
    </>
  );
};

export default TextFeedback;
