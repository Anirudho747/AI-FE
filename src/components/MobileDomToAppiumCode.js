// src/components/UserStoryToManualTestcasePage.js
import React, { useState } from "react";

const GeneratePOM = () => {
  const [htmlInput, setHtmlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const generatePOMAndDownload = async () => {
    if (!htmlInput.trim()) {
      setErrorMessage("Please enter valid HTML elements.");
      return;
    }
    setLoading(true);
    setErrorMessage("");

    try {
      let response = await fetch("http://localhost:8080/api/pom/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ htmlContent: htmlInput })
      });

      if (!response.ok) throw new Error("Failed to generate POM");

      let blob = await response.blob();
      let url = window.URL.createObjectURL(blob);
      let link = document.createElement("a");
      link.href = url;
      link.download = "GeneratedPOM.java";
      link.click();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="container">
        <h2>Generate POM Class from DOM Elements</h2>
        {errorMessage && <div className="error">{errorMessage}</div>}
        <textarea
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            placeholder="Paste your HTML elements here..."
        />
        <button onClick={generatePOMAndDownload} disabled={loading}>
          {loading ? "Generating & Downloading..." : "Generate & Download POM"}
        </button>
      </div>
  );
};

export default GeneratePOM;
