import { useState, useEffect } from "react";
import { CVData } from "@/app/LLM/LLMClient";

interface CVStorage {
  feedback: string;
  cvData: CVData | null;
}

export const useCVStorage = () => {
  const [storage, setStorage] = useState<CVStorage>({
    feedback: "",
    cvData: null,
  });

  useEffect(() => {
    const savedData = localStorage.getItem("cvStorage");
    if (savedData) {
      try {
        setStorage(JSON.parse(savedData));
      } catch (error) {
        console.error("Failed to parse CV storage data:", error);
      }
    }
  }, []);

  const updateStorage = (newData: Partial<CVStorage>) => {
    setStorage((prevStorage) => {
      const updatedStorage = { ...prevStorage, ...newData };
      localStorage.setItem("cvStorage", JSON.stringify(updatedStorage));
      return updatedStorage;
    });
  };

  const clearStorage = () => {
    localStorage.removeItem("cvStorage");
    setStorage({ feedback: "", cvData: null });
  };

  return {
    ...storage,
    updateStorage,
    clearStorage,
  };
};
