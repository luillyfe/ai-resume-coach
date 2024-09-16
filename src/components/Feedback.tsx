import { useState, MouseEvent } from "react";

import { Tabs, message, Button, Spin } from "antd";
import { RcFile } from "antd/es/upload";
import { PDFDownloadLink } from "@react-pdf/renderer";

import {
  extractCVData,
  requestCVFeedback,
  sendFileToLLM,
} from "@/app/actions/LLM";
import { useCVStorage } from "@/app/hooks/useCVStorage";

import PDFGenerator from "@/components/PDFGenerator";
import TextFeedback from "@/components/TextFeedback";
import VisualCV from "@/components/VisualCV";

const { TabPane } = Tabs;

function Feedback({ file }: { file: RcFile | undefined }) {
  const [loading, setLoading] = useState<boolean>(false);
  const { feedback, cvData, updateStorage } = useCVStorage();

  async function handleRequestCVFeedback(formData: FormData) {
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
        "There was a problem on your request, try again in a few seconds!"
      );
    }
  }

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
      await handleRequestCVFeedback(formData);
    } catch (error) {
      console.error("Error requesting CV feedback:", error);
      message.error("Failed to get feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
      </>

      {feedback && (
        <Tabs defaultActiveKey="2">
          <TabPane tab="Insights" key="1">
            {cvData && <VisualCV cvData={cvData} />}
          </TabPane>
          <TabPane tab="Feedback" key="2">
            <TextFeedback feedback={feedback} />
          </TabPane>
        </Tabs>
      )}
    </>
  );
}

export default Feedback;
