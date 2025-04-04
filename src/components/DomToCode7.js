// src/components/UserStoryToManualTestcasePage.js
import React, { useState } from 'react';
import AceEditor from 'react-ace';
import { FaExchangeAlt } from 'react-icons/fa';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/mode-gherkin'; // For BDD user stories
import 'ace-builds/src-noconflict/mode-text'; // For manual test cases

function DomToCode7() {
  const [domElements, setDomElements] = useState('');
  const [appiumCode, setAppiumCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generationMessage, setGenerationMessage] = useState('');

  // Convert Mobile Elements to Appium Code
  async function handleGenerateAppiumCode() {
    if (!domElements.trim()) {
      alert('Please enter Selenium Code');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/generate/manualTestcase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domElements }),
      });

      if (!response.ok) {
        const errMsg = await response.text();
        alert('Generation failed: ' + errMsg);
        return;
      }

      const generated = await response.text();
      setAppiumCode(generated);
      setGenerationMessage('Appium Code generated successfully!');
    } catch (err) {
      console.error(err);
      setGenerationMessage('Error generating Appium Code: ' + err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
      <div className="main-content">
        <h2>Mobile DOM to Appium Code Generation</h2>
        <div className="editor-container">
          <div className="editor-wrapper">
            <h4>Mobile DOM Elements</h4>
            <AceEditor
                mode="gherkin"
                theme="textmate"
                name="domElementsEditor"
                width="100%"
                height="400px"
                fontSize={14}
                value={domElements}
                onChange={(newValue) => setDomElements(newValue)}
                editorProps={{ $blockScrolling: true }}
                setOptions={{ useWorker: false }}
            />
          </div>
          <div className="convert-icon" onClick={handleGenerateAppiumCode} title="Generate Appium Code">
            <FaExchangeAlt size={30} color="#2c3e50" />
          </div>
          <div className="editor-wrapper">
            <h4>Generated Appium Code</h4>
            <AceEditor
                mode="text"
                theme="textmate"
                name="TestcaseEditor"
                width="100%"
                height="400px"
                fontSize={14}
                value={appiumCode}
                onChange={(newValue) => setAppiumCode(newValue)}
                editorProps={{ $blockScrolling: true }}
                setOptions={{ useWorker: false }}
            />
            <div style={{ marginTop: '10px' }}>
              <button onClick={handleGenerateAppiumCode} disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Appium Code'}
              </button>
            </div>
            <div className="message">{generationMessage}</div>
          </div>
        </div>
      </div>
  );
}

export default DomToCode7;
