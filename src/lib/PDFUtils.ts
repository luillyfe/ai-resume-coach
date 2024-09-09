// PDFUtils contains utilities for dealing with PDF files

// @ts-expect-error: no types were found on registry
import pdf from "pdf-parse-debugging-disabled";

interface File {
  type: string;
  arrayBuffer: () => Promise<ArrayBuffer>;
}

/**
  The parsePDF function is designed to handle file uploads, specifically 
  PDF files, within a web application. It takes the uploaded file data 
  from a FormData object, validates that it's a PDF, extracts the text 
  content from the PDF using an external library, and returns the extracted text.

  @param formData - The FormData object containing the uploaded file.
  @returns A Promise that resolves to the extracted text content of the PDF file.
  @throws An error if no file is uploaded or if the uploaded file is not a PDF.
**/
export async function parsePDF(formData: FormData) {
  // Retrieve the uploaded file from the FormData object using the key 'cv'.
  const file = formData.get("cv") as File;

  // Check if a file was actually uploaded.
  if (!file) {
    throw new Error("No file uploaded");
  }

  // Validate that the uploaded file is indeed a PDF based on its MIME type.
  if (file.type !== "application/pdf") {
    throw new Error("Uploaded file must be a PDF");
  }

  // Convert the uploaded file into an ArrayBuffer, which represents the file's raw binary data.
  const arrayBuffer = await file.arrayBuffer();

  // Extract text from PDF
  const data = await pdf(arrayBuffer);

  // Return the extracted text content.
  return data.text;
}
