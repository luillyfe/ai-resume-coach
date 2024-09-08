"use client";
import { InboxOutlined } from "@ant-design/icons";

import { RcFile, UploadChangeParam } from "antd/es/upload";
import { Upload, message } from "antd";
import { Dispatch, SetStateAction } from "react";
const { Dragger } = Upload;

/**
 * Component for uploading a PDF file.
 * Provides a drag-and-drop area for file selection.
 * Accepts only PDF files and allows single file uploads.
 *
 * @param {object} props - Component props
 * @param {function} props.handleFile - Function to call when a file is uploaded.
 * @returns {JSX.Element} The PDFUploader component.
 */
export function PDFUploader({
  handleFile,
}: {
  handleFile: Dispatch<SetStateAction<RcFile | undefined>>;
}) {
  /**
   * Handles the file upload event.
   * Displays success or error messages based on the upload status.
   * Calls the `handleFile` function with the uploaded file object.
   *
   * @param {UploadChangeParam} info - Information about the upload event.
   */
  const handleFileUpload = (info: UploadChangeParam) => {
    const { status } = info.file;
    if (status === "done") {
      handleFile(info.file.originFileObj);
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <Dragger accept=".pdf" onChange={handleFileUpload} className="mb-4">
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
  );
}
