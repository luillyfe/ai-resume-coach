"use client";
import React, { useState } from "react";
import { Upload, Button, Card, Spin, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

const CVFeedbackApp = () => {
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
    // TODO: Send the file to your backend to interact with the LLM API
    setTimeout(() => {
      setFeedback(`
        Thank you for submitting your CV. Here's some feedback:

        1. Structure: Your CV has a good overall structure, but consider reorganizing sections for better flow.
        2. Skills: Highlight your technical skills more prominently.
        3. Experience: Quantify your achievements with specific metrics where possible.
        4. Education: Include relevant coursework or projects.
        5. Formatting: Ensure consistent formatting throughout the document.

        Action items:
        - Add a concise professional summary at the top.
        - Create a dedicated skills section with proficiency levels.
        - Use bullet points for work experience achievements.
        - Include a section for certifications and awards.

        Overall, your CV shows strong potential. Implementing these suggestions will make it even more impactful to potential employers in the tech sector.
      `);
      setLoading(false);
    }, 3000);
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
          <pre className="whitespace-pre-wrap">{feedback}</pre>
        </Card>
      )}
    </div>
  );
};

export default CVFeedbackApp;
