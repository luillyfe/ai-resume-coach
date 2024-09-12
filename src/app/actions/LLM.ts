"use server";
import { parsePDF } from "@/lib/PDFUtils";
import { CVData, sendMessage } from "@/app/LLM/LLMClient";
import { formatGeminiOutput } from "@/lib/LLMUtils";

// Server Function
export async function requestCVFeedback(
  formData: FormData
): Promise<{ feedback: string }> {
  const fileContent = await parsePDF(formData);

  const prompt = `
          You are an expert CV reviewer for the tech industry. Analyze the following CV and provide detailed, actionable feedback. Focus on:
          1. Overall structure and formatting
          2. Professional summary
          3. Work experience (including quantifiable achievements)
          4. Skills section
          5. Education and certifications
          6. Projects or portfolio
          7. Tailoring for tech roles
    
          Provide specific suggestions for improvement and highlight any red flags. 
          Format your response in markdown for easy reading.
    
          Here's the CV content:
    
          ${fileContent}
        `;

  const geminiData = await sendMessage(prompt);
  const feedback = formatGeminiOutput(geminiData);

  return { feedback };
}

export async function extractCVData(
  feedbackResponse: string,
  originalCV: string
): Promise<CVData> {
  const extractionPrompt = `
      Based on the original CV content and the feedback provided, extract and structure the following information in a JSON format:
  
      1. name: The full name of the CV owner
      2. title: The current or desired job title
      3. summary: A brief professional summary (max 50 words)
      4. experience: An array of the most recent 3 job experiences, each containing:
         - position
         - company
         - duration
         - keyAchievement (one notable achievement, preferably with quantifiable results)
      5. skills: An array of top 5 skills with a proficiency level (1-100)
      6. education: An array of up to 2 most relevant educational qualifications, each containing:
         - degree
         - school
         - year
      7. achievements: An array of up to 3 notable professional achievements or awards
      8. improvementAreas: An array of 3 key areas for improvement based on the feedback
      9. overallScore: A number from 1-100 representing the overall quality of the CV
  
      Original CV:
      ${originalCV}
  
      Feedback:
      ${feedbackResponse}
  
      Ensure all data is accurately extracted or reasonably inferred from the provided information. If any information is missing, use placeholder text or omit the field. Please remove \`\`\`json and \`\`\` from the output.
    `;

  const structuredDataResponse = await sendMessage(extractionPrompt);

  try {
    // From json string to json object
    const cvData = JSON.parse(formatGeminiOutput(structuredDataResponse));
    return cvData;
  } catch (error) {
    console.error("Error parsing structured CV data:", error);
    return {
      name: "",
      title: "",
      summary: "",
      experience: [],
      skills: [],
      education: [],
      achievements: [],
    };
  }
}
