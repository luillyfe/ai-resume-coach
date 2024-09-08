"use client";
import React, { useState } from "react";

import { Button, Card, Spin, message } from "antd";
import { RcFile } from "antd/es/upload";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Component for handling text feedback of a CV.
 * Allows users to upload a CV and receive text feedback.
 *
 * @param {object} props - Component props
 * @param {string} props.feedback - The feedback text to display.
 * @param {function} props.requestCVFeedback - Function to call when requesting feedback.
 * @param {RcFile} props.file - The uploaded CV file.
 * @returns {JSX.Element} The TextFeedback component.
 */
const TextFeedback = ({
  feedback,
  requestCVFeedback,
  file,
}: {
  feedback: string;
  requestCVFeedback: (userPrompt: FormData) => Promise<void>;
  file: RcFile | undefined;
}) => {
  const [loading, setLoading] = useState(false);

  /**
   * Handles the feedback request when the "Get Feedback" button is clicked.
   * Displays an error message if no file is uploaded.
   * Sets the loading state while waiting for the feedback.
   */
  const getFeedback = async () => {
    if (!file) {
      message.error("Please upload a CV first");
      return;
    }
    const formData = new FormData();

    setLoading(true);
    formData.append("cv", file);
    await requestCVFeedback(formData);
    setLoading(false);
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
