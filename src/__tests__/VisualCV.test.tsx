import React from "react";

import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

import { CVData } from "@/app/LLM";
import VisualCV from "@/components/VisualCV";

// Mock the ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Stub the global ResizeObserver
vi.stubGlobal("ResizeObserver", ResizeObserverMock);

describe("VisualCV", () => {
  const cvData: CVData = {
    name: "John Doe",
    title: "Software Engineer",
    summary: "Experienced software engineer with a passion for building...",
    experience: [
      {
        position: "Software Engineer",
        company: "Tech Company",
        duration: "2020-Present",
        responsibilities: [],
      },
    ],
    // TODO: make sure they get render into the chart
    skills: [
      { skill: "JavaScript", proficiency: 90 },
      { skill: "React", proficiency: 80 },
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        school: "University of Example",
        year: "2019",
      },
    ],
    achievements: [
      "Awarded Employee of the Month",
      "Completed certification in...",
    ],
  };

  it("renders CV data correctly", () => {
    const { getByText, getAllByText } = render(<VisualCV cvData={cvData} />);

    expect(getByText("John Doe")).toBeInTheDocument();
    expect(getAllByText("Software Engineer")[0]).toBeInTheDocument();
    expect(
      getByText("Experienced software engineer with a passion for building...")
    ).toBeInTheDocument();

    expect(getByText("Tech Company | 2020-Present")).toBeInTheDocument();

    expect(
      getByText("Bachelor of Science in Computer Science")
    ).toBeInTheDocument();
    expect(getByText("University of Example | 2019")).toBeInTheDocument();

    expect(getByText("Awarded Employee of the Month")).toBeInTheDocument();
    expect(getByText("Completed certification in...")).toBeInTheDocument();
  });
});
