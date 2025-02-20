// src/components/GenerateCodePage.js
import React, { useState, useRef } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/mode-java';
import PushCodeModal from './PushCodeModal';

function GenerateCodePage() {
  const [swaggerFile, setSwaggerFile] = useState(null);
  const [swaggerUrl, setSwaggerUrl] = useState('');
  const [apiDetails, setApiDetails] = useState('');
  const [javaCode, setJavaCode] = useState('');
  const [testResults, setTestResults] = useState('');
  const [testTypes, setTestTypes] = useState({
    positive: false,
    negative: false,
    edge: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPushModal, setShowPushModal] = useState(false);

  const fileInputRef = useRef(null);

  // Handle checkbox changes
  const handleTestTypeChange = (e) => {
    const { name, checked } = e.target;
    setTestTypes((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // 1. Parse Swagger
  async function handleParseSwagger() {
    if (!swaggerFile && !swaggerUrl.trim()) {
      alert('Please provide a Swagger file or URL');
      return;
    }
    setIsLoading(true);
    try {
      let formData = new FormData();
      if (swaggerFile) {
        formData.append('file', swaggerFile);
      } else {
        alert('URL parsing not implemented; please upload a file.');
        return;
      }
      const response = await fetch('http://localhost:8080/api/parseSwagger', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        let errMsg = await response.text();
        alert('Parse failed: ' + errMsg);
        return;
      }
      const details = await response.text();
      setApiDetails(details);
    } catch (err) {
      console.error(err);
      alert('Error parsing swagger: ' + err);
    } finally {
      setIsLoading(false);
    }
  }

  // 2. Generate Tests
  async function handleGenerateTests() {
    if (!apiDetails.trim()) {
      alert('No API details found. Parse the Swagger first.');
      return;
    }
    setIsLoading(true);
    try {
      const selectedTestTypes = Object.keys(testTypes).filter((key) => testTypes[key]);
      const requestBody = { apiDetails, testTypes: selectedTestTypes };
      const response = await fetch('http://localhost:8080/api/generateTests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        let errMsg = await response.text();
        alert('Generate Tests failed: ' + errMsg);
        return;
      }
      const code = await response.text();
      setJavaCode(code);
    } catch (err) {
      console.error(err);
      alert('Error generating tests: ' + err);
    } finally {
      setIsLoading(false);
    }
  }

  // 3. Run Tests
  async function handleRunTests() {
    if (!javaCode.trim()) {
      alert('No Java code to run. Generate or paste some code first.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/runTests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ javaCode }),
      });
      const resultData = await response.json();
      setTestResults(JSON.stringify(resultData, null, 2));
    } catch (err) {
      console.error(err);
      setTestResults('Error: ' + err);
    } finally {
      setIsLoading(false);
    }
  }

  // 4. Reset
  function handleReset() {
    setJavaCode('');
    setTestResults('');
    setTestTypes({
      positive: false,
      negative: false,
      edge: false,
    });
  }

  // 5. Handle Push Code from Modal
  async function handlePushCode(branch, commitMessage) {
    // Build the payload with branch, commitMessage, and the generated code
    try {
      setIsLoading(true);
      const payload = {
        branch,
        commitMessage,
        javaCode,
      };
      const response = await fetch('http://localhost:8080/api/github/pushCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errMsg = await response.text();
        alert('Push Code failed: ' + errMsg);
      } else {
        const result = await response.text();
        alert('Push Code Success: ' + result);
      }
    } catch (err) {
      console.error(err);
      alert('Error pushing code: ' + err);
    } finally {
      setIsLoading(false);
      setShowPushModal(false);
    }
  }

  return (
    <div className="main-content">
      <h2>Generate Rest-Assured Code</h2>

      <div className="section">
        <label>Upload Swagger File: </label>
        <input
          type="file"
          ref={fileInputRef}
          accept=".yml,.yaml,.json"
          onChange={(e) => setSwaggerFile(e.target.files[0])}
        />
        <br />
        <button onClick={handleParseSwagger} disabled={isLoading}>
          {isLoading ? 'Parsing...' : 'Parse Swagger'}
        </button>
      </div>
      <div className="section">
        <h4>Parsed API Details</h4>
        <textarea
          rows="5"
          style={{ width: '100%' }}
          value={apiDetails}
          onChange={(e) => setApiDetails(e.target.value)}
        />
        <br /><br />
        <label>Test Type: </label>
        <div className="test-type-container">
          <label className="test-type-label">
            <input
              type="checkbox"
              name="positive"
              checked={testTypes.positive}
              onChange={handleTestTypeChange}
            />
            Positive
          </label>
          <label className="test-type-label">
            <input
              type="checkbox"
              name="negative"
              checked={testTypes.negative}
              onChange={handleTestTypeChange}
            />
            Negative
          </label>
          <label className="test-type-label">
            <input
              type="checkbox"
              name="edge"
              checked={testTypes.edge}
              onChange={handleTestTypeChange}
            />
            Edge
          </label>
        </div>
        <br />
        <button onClick={handleGenerateTests} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Tests'}
        </button>
      </div>
      {isLoading && <div className="loading-spinner"></div>}
      <div className="section">
        <h4>Generated Java Code</h4>
        <div className="code-editor">
          <AceEditor
            mode="java"
            theme="textmate"
            name="javaEditor"
            width="100%"
            height="300px"
            fontSize={14}
            value={javaCode}
            onChange={(newValue) => setJavaCode(newValue)}
            editorProps={{ $blockScrolling: true }}
            setOptions={{ useWorker: false }}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <button onClick={handleRunTests} disabled={isLoading}>
            {isLoading ? 'Running...' : 'Run Tests'}
          </button>
          <button onClick={handleReset} style={{ marginLeft: '10px' }}>
            Reset
          </button>
          <button onClick={() => setShowPushModal(true)} style={{ marginLeft: '10px' }}>
            Push Code
          </button>
        </div>
      </div>

      <div className="section">
        <h4>Test Results</h4>
        <pre className="test-results">{testResults}</pre>
      </div>

      {showPushModal && (
        <PushCodeModal
          isOpen={showPushModal}
          onClose={() => setShowPushModal(false)}
          onPush={handlePushCode}
        />
      )}

    </div>
  );
}

export default GenerateCodePage;
