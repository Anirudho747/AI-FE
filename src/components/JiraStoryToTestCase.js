import React, { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaInfoCircle } from "react-icons/fa";
import AceEditor from 'react-ace';

const GenerateManualTestCases = () => {
  const [testType, setTestType] = useState({
    positive: false,
    negative: false,
    edge: false,
  });
  const [applicationUrl, setApplicationUrl] = useState("");
  const [userStory, setUserStory] = useState("");
  const [acceptanceCriteria, setAcceptanceCriteria] = useState("");
  const [epicStory, setEpicStory] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});
  const errorRef = useRef(null);

  const handleTestTypeChange = (type) => {
    setTestType((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const validateFields = () => {
    let newErrors = {};

    if (!applicationUrl.trim()) newErrors.applicationUrl = true;
    if (!userStory.trim()) newErrors.userStory = true;
    if (!acceptanceCriteria.trim()) newErrors.acceptanceCriteria = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorMessage("Please fill in the required fields.");
      setTimeout(() => {
        if (errorRef.current) {
          errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return false;
    }

    setErrors({});
    setErrorMessage("");
    return true;
  };

  const generateTestCasesAndDownload = async () => {
    if (!validateFields()) return;

    setLoading(true);

    try {
      let response = await fetch("http://localhost:8080/api/generateTestCases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testType,
          userStoryDescription: userStory,
          applicationUrl,
          acceptanceCriteria,
          epicDescription: epicStory,
          additionalInstructions,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate test cases");

      let jsonResponse = await response.json();

      let excelResponse = await fetch("http://localhost:8080/api/downloadTestCases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonResponse),
      });

      if (!excelResponse.ok) throw new Error("Failed to convert test cases to Excel");

      let blob = await excelResponse.blob();
      let url = window.URL.createObjectURL(blob);
      let link = document.createElement("a");
      link.href = url;
      link.download = "test_cases.xlsx";
      link.click();

      // Clear all inputs after successful generation
      setTestType({ positive: false, negative: false, edge: false });
      setApplicationUrl("");
      setUserStory("");
      setAcceptanceCriteria("");
      setEpicStory("");
      setAdditionalInstructions("");

      setErrorMessage(""); // Clear any existing errors

      // Show success toast
      toast.success("Test case generation is successful!");
    } catch (error) {
      setErrorMessage(error.message);
      setTimeout(() => {
        if (errorRef.current) {
          errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="section generate-manual-testcases">
        <h2>Generate Manual Test Cases</h2>

        {errorMessage && <div ref={errorRef} className="error-message">{errorMessage}</div>}

        <div className={`form-group ${errors.applicationUrl ? "error" : ""}`}>
          <label>Application URL:</label>
          <input
              type="text"
              value={applicationUrl}
              onChange={(e) => setApplicationUrl(e.target.value)}
              placeholder="Enter Application URL"
          />
        </div>

        <div className={`form-group ${errors.userStory ? "error" : ""}`}>
          <label>User Story Description:</label>
          <textarea
              value={userStory}
              onChange={(e) => setUserStory(e.target.value)}
              placeholder="Enter user story description"
          />
        </div>

        <div className={`form-group ${errors.acceptanceCriteria ? "error" : ""}`}>
          <label>Acceptance Criteria:</label>
          <textarea
              value={acceptanceCriteria}
              onChange={(e) => setAcceptanceCriteria(e.target.value)}
              placeholder="Enter acceptance criteria"
          />
        </div>

        <div className="form-group">
          <label>Epic Story Description (Optional):</label>
          <textarea
              value={epicStory}
              onChange={(e) => setEpicStory(e.target.value)}
              placeholder="Enter epic story description (optional)"
          />
        </div>

        <div className="form-group">
          <label>Test Type:</label>
          <div className="checkbox-group">
            <label>
              <input type="checkbox" checked={testType.positive} onChange={() => handleTestTypeChange("positive")} />
              Positive
            </label>
            <label>
              <input type="checkbox" checked={testType.negative} onChange={() => handleTestTypeChange("negative")} />
              Negative
            </label>
            <label>
              <input type="checkbox" checked={testType.edge} onChange={() => handleTestTypeChange("edge")} />
              Edge
            </label>
          </div>
        </div>

        <button onClick={generateTestCasesAndDownload} disabled={loading}>
          {loading ? "Generating & Downloading..." : "Generate and Download Test Cases"}
        </button>

        {loading && <div className="spinner">Loading...</div>}

        <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      </div>
  );
};

export default GenerateManualTestCases;
