import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { User, Briefcase, GraduationCap, Code, Award } from "lucide-react";
import { CVData } from "@/app/LLM/CVReviewerClient";

/**
 *  Renders a visually appealing CV based on the provided data,
 *  making it easy to grasp the key information from a CV at a glance.
 *
 * @param {object} props - Component props.
 * @param {CVData} props.cvData - The CV data to display.
 * @returns {JSX.Element} - The rendered VisualCV component.
 */
const VisualCV: React.FC<{
  cvData: CVData;
  styles: string;
}> = ({ cvData, styles }) => {
  // Transform skills data for the bar chart
  const skillsData = cvData.skills.map(
    (skill: { skill: string; proficiency: number }) => ({
      name: skill.skill,
      proficiency: skill.proficiency,
    })
  );

  return (
    <div
      className={`${styles} bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto`}
    >
      {/* Header Section */}
      <div className="flex items-center mb-6">
        {/* Placeholder for profile picture */}
        <div className="w-24 h-24 bg-gray-300 rounded-full mr-6"></div>
        <div>
          <h1 className="text-3xl font-bold">{cvData.name}</h1>
          <p className="text-xl text-gray-600">{cvData.title}</p>
        </div>
      </div>

      {/* About Me and Experience Section */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* About Me */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <User className="mr-2" /> About Me
          </h2>
          <p className="text-gray-700">{cvData.summary}</p>
        </div>

        {/* Experience */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Briefcase className="mr-2" /> Experience
          </h2>
          {cvData.experience.map((exp, index) => (
            <div key={index} className="mb-3">
              <h3 className="font-semibold">{exp.position}</h3>
              <p className="text-sm text-gray-600">
                {exp.company} | {exp.duration}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Code className="mr-2" /> Skills
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={skillsData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="proficiency" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Education and Achievements Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Education */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <GraduationCap className="mr-2" /> Education
          </h2>
          {cvData.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <h3 className="font-semibold">{edu.degree}</h3>
              <p className="text-sm text-gray-600">
                {edu.school} | {edu.year}
              </p>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Award className="mr-2" /> Achievements
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            {cvData.achievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VisualCV;
