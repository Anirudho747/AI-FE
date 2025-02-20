// src/components/SeleniumToPlaywrightPage.js
import React, { useState } from 'react';
import AceEditor from 'react-ace';
import { FaExchangeAlt } from 'react-icons/fa';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-typescript';

function SeleniumToPlaywrightPage() {
  const [seleniumCode, setSeleniumCode] = useState('');
  const [playwrightCode, setPlaywrightCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [compileMessage, setCompileMessage] = useState('');
  const [runMessage, setRunMessage] = useState('');
  const [resultURL, setResultURL] = useState('');

  // Convert Selenium code to Playwright code
  async function handleConvert() {
    if (!seleniumCode.trim()) {
      alert('Please enter Selenium code.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/convert/seleniumToPlaywright', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seleniumCode })
      });
      if (!response.ok) {
        const errMsg = await response.text();
        alert('Conversion failed: ' + errMsg);
        return;
      }
      const converted = await response.text();
      setPlaywrightCode(converted);
    } catch (err) {
      console.error(err);
      alert('Error converting code: ' + err);
    } finally {
      setIsLoading(false);
    }
  }

  // Compile Selenium code (stub endpoint)
  async function handleCompileSelenium() {
    if (!seleniumCode.trim()) {
      alert('Please enter Selenium code.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/convert/compileSelenium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: seleniumCode })
      });
      const message = await response.text();
      setCompileMessage(message);
    } catch (err) {
      console.error(err);
      setCompileMessage('Error compiling code: ' + err);
    } finally {
      setIsLoading(false);
    }
  }

 // Run Playwright code
  async function handleRunPlaywright() {
    if (!playwrightCode.trim()) {
      alert('Please convert code first.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/convert/runPlaywrightProxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: playwrightCode, language: 'javascript' })
      });
      if (!response.ok) {
        const errMsg = await response.text();
        alert('Run failed: ' + errMsg);
        return;
      }
      const result = await response.json();
      setRunMessage(result.output);
      
      if (result.files && result.files.length > 0) {
        // Extract the publicURL from the first file
        let publicURL = result.files[0].publicURL;
        // If the publicURL is relative, prefix with the domain
        if (publicURL.startsWith("/")) {
          publicURL = "https://try.playwright.tech" + publicURL;
        }
        // Build the final URL for trace viewer and URL-encode the publicURL
        const finalURL = "https://trace.playwright.dev/?trace=" + encodeURIComponent(publicURL);
        setResultURL(finalURL);
      } else {
        setResultURL('');
      }
    } catch (err) {
      console.error(err);
      setRunMessage('Error running code: ' + err);
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div className="main-content">
      <h2>Selenium to Playwright Conversion</h2>
      <div className="editor-container">
        <div className="editor-wrapper">
          <h4>Selenium Java Code</h4>
          <AceEditor
            mode="java"
            theme="textmate"
            name="seleniumEditor"
            width="100%"
            height="750px"
            fontSize={14}
            value={seleniumCode}
            onChange={(newValue) => setSeleniumCode(newValue)}
            editorProps={{ $blockScrolling: true }}
            setOptions={{ useWorker: false }}
          />
          <div style={{ marginTop: '10px' }}>
            <button onClick={handleCompileSelenium} disabled={isLoading}>
              {isLoading ? 'Compiling...' : 'Compile Selenium Code'}
            </button>
          </div>
          <div className="message">{compileMessage}</div>
        </div>
        <div className="convert-icon" onClick={handleConvert} title="Convert Selenium to Playwright">
          <FaExchangeAlt size={30} color="#2c3e50" />
        </div>
        <div className="editor-wrapper">
          <h4>Playwright TypeScript Code</h4>
          <AceEditor
            mode="typescript"
            theme="textmate"
            name="playwrightEditor"
            width="100%"
            height="750px"
            fontSize={14}
            value={playwrightCode}
            onChange={(newValue) => setPlaywrightCode(newValue)}
            editorProps={{ $blockScrolling: true }}
            setOptions={{ useWorker: false }}
          />
          <div style={{ marginTop: '10px' }}>
            <button onClick={handleRunPlaywright} disabled={isLoading}>
              {isLoading ? 'Running...' : 'Run Playwright Code'}
            </button>
            {resultURL && (
              <button 
                onClick={() => window.open(resultURL, '_blank')}
                style={{ marginLeft: '10px' }}
              >
                View Results
              </button>
            )}
          </div>
          <div className="message">{runMessage}</div>
        </div>
      </div>
    </div>
  );
}

export default SeleniumToPlaywrightPage;
