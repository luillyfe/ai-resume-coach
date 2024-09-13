import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { useCVStorage } from "@/app/hooks/useCVStorage";

describe("useCVStorage", () => {
  const mockCVData = {
    name: "John Doe",
    title: "Software Developer",
    summary: "",
    experience: [],
    skills: [],
    education: [],
    achievements: [],
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Mock console.error to prevent error logging during tests
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should initialize with empty values", () => {
    const { result } = renderHook(() => useCVStorage());
    expect(result.current.feedback).toBe("");
    expect(result.current.cvData).toBeNull();
  });

  it("should update storage with new feedback", () => {
    const { result } = renderHook(() => useCVStorage());
    act(() => {
      result.current.updateStorage({ feedback: "Great CV!" });
    });
    expect(result.current.feedback).toBe("Great CV!");
    expect(JSON.parse(localStorage.getItem("cvStorage") || "{}")).toEqual({
      feedback: "Great CV!",
      cvData: null,
    });
  });

  it("should update storage with new CV data", () => {
    const { result } = renderHook(() => useCVStorage());
    act(() => {
      result.current.updateStorage({ cvData: mockCVData });
    });
    expect(result.current.cvData).toEqual(mockCVData);
    expect(JSON.parse(localStorage.getItem("cvStorage") || "{}")).toEqual({
      feedback: "",
      cvData: mockCVData,
    });
  });

  it("should clear storage", () => {
    const { result } = renderHook(() => useCVStorage());
    act(() => {
      result.current.updateStorage({ feedback: "Test", cvData: mockCVData });
    });
    act(() => {
      result.current.clearStorage();
    });
    expect(result.current.feedback).toBe("");
    expect(result.current.cvData).toBeNull();
    expect(localStorage.getItem("cvStorage")).toBeNull();
  });

  it("should load existing data from localStorage on initialization", () => {
    localStorage.setItem(
      "cvStorage",
      JSON.stringify({ feedback: "Existing feedback", cvData: mockCVData })
    );
    const { result } = renderHook(() => useCVStorage());
    expect(result.current.feedback).toBe("Existing feedback");
    expect(result.current.cvData).toEqual(mockCVData);
  });

  it("should handle localStorage errors", () => {
    // Simulate a localStorage error
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Failed to parse CV storage data:");
    });
    const { result } = renderHook(() => useCVStorage());
    expect(result.current.feedback).toBe("");
    expect(result.current.cvData).toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      "Failed to parse CV storage data:",
      expect.any(Error)
    );
  });
});
