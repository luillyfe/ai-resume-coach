"use client";
import React, { useState } from "react";
import { Upload, Button, Card, Spin, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const { Dragger } = Upload;

const CVFeedbackApp = ({
  sendMessage,
}: {
  sendMessage: (userPrompt: FormData) => Promise<string>;
}) => {
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (info) => {
    const { status } = info.file;
    if (status === "done") {
      setFile(info.file.originFileObj);
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const getFeedback = async () => {
    if (!file) {
      message.error("Please upload a CV first");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("cv", file);
    const feedback = await sendMessage(formData);
    setFeedback(feedback);
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">CV Feedback Tool</h1>
      <Dragger
        accept=".pdf,.doc,.docx"
        onChange={handleFileUpload}
        className="mb-4"
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag CV file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single file upload. Strictly prohibit from uploading
          company data or other sensitive files.
        </p>
      </Dragger>
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
    </div>
  );
};

export default CVFeedbackApp;
