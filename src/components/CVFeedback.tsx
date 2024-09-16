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

import { Card } from "antd";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const TextFeedback: React.FC<{
  feedback: string;
  styles: string;
}> = ({ feedback, styles }) => {
  return (
    <>
      {feedback && (
        <Card title="CV Feedback" className={`${styles} mb-4`}>
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
