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

const { TabPane } = Tabs;

interface CVAnalyzerProps {
  file: RcFile | undefined;
}

const CVAnalyzer: React.FC<CVAnalyzerProps> = ({ file }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { feedback, cvData, updateStorage } = useCVStorage();

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

        {isLoading && <Spin className="cv-analyzer__loading-spinner" />}

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
        <Tabs defaultActiveKey="feedback" className="cv-analyzer__results">
          <TabPane tab="Feedback" key="feedback">
            <CVFeedback feedback={feedback} styles="cv-feedback" />
          </TabPane>
          <TabPane tab="Insights" key="insights">
            {cvData && <CVInsights cvData={cvData} styles="cv-insights" />}
          </TabPane>
        </Tabs>
      )}
    </div>
  );
};

export default CVAnalyzer;
