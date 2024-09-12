/**
 * @module useCVStorage
 * @description A custom React hook for managing CV data storage in localStorage.
 *
 * @requires react
 * @requires @/app/LLM/LLMClient
 */

import { useState, useEffect } from "react";
import { CVData } from "@/app/LLM/LLMClient";

/**
 * @interface CVStorage
 * @description Represents the structure of the CV storage data.
 */
interface CVStorage {
  /** The feedback text for the CV. */
  feedback: string;
  /** The structured CV data. */
  cvData: CVData | null;
}

/**
 * @function useCVStorage
 * @description A custom hook that manages CV data storage in localStorage.
 *
 * @returns {Object} An object containing the current storage state and utility functions.
 * @property {string} feedback - The current feedback text.
 * @property {CVData | null} cvData - The current structured CV data.
 * @property {function} updateStorage - Function to update the storage.
 * @property {function} clearStorage - Function to clear the storage.
 *
 * @example
 * // Basic usage
 * const { feedback, cvData, updateStorage, clearStorage } = useCVStorage();
 *
 * // Update the storage with new feedback
 * updateStorage({ feedback: 'New feedback' });
 *
 * // Update the storage with new CV data
 * updateStorage({ cvData: newCVData });
 *
 * // Clear the storage
 * clearStorage();
 *
 * @example
 * // Usage in a component
 * function CVManager() {
 *   const { feedback, cvData, updateStorage } = useCVStorage();
 *
 *   const handleNewFeedback = (newFeedback) => {
 *     updateStorage({ feedback: newFeedback });
 *   };
 *
 *   return (
 *     <div>
 *       <p>Current Feedback: {feedback}</p>
 *       <button onClick={() => handleNewFeedback('Great CV!')}>
 *         Add Feedback
 *       </button>
 *     </div>
 *   );
 * }
 *
 * @throws {Error} If localStorage is not available or if there's an error parsing stored data.
 *
 * @note This hook uses localStorage, which has a storage limit of about 5MB.
 * Be cautious when storing large amounts of data.
 */
export const useCVStorage = () => {
  const [storage, setStorage] = useState<CVStorage>({
    feedback: "",
    cvData: null,
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("cvStorage");
      if (savedData) {
        setStorage(JSON.parse(savedData));
      }
    } catch (error) {
      console.error("Failed to parse CV storage data:", error);
    }
  }, []);

  /**
   * @function updateStorage
   * @description Updates the CV storage with new data.
   * @param {Partial<CVStorage>} newData - The new data to update in the storage.
   */
  const updateStorage = (newData: Partial<CVStorage>) => {
    setStorage((prevStorage) => {
      const updatedStorage = { ...prevStorage, ...newData };
      localStorage.setItem("cvStorage", JSON.stringify(updatedStorage));
      return updatedStorage;
    });
  };

  /**
   * @function clearStorage
   * @description Clears all CV data from the storage.
   */
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
