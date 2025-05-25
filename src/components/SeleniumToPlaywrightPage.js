// Updated SeleniumToPlaywrightPage.js
import React, { useState, useEffect } from 'react';
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
  const [llmApiKey, setLlmApiKey] = useState('');
  const [llmModel, setLlmModel] = useState('');
  const [llmApiUrl, setLlmApiUrl] = useState('');

  useEffect(() => {
    const savedConfig = JSON.parse(localStorage.getItem('llmConfig'));
    if (savedConfig) {
      const providerApiUrls = {
        openai: 'https://api.openai.com/v1/chat/completions',
        groq: 'https://api.groq.com/openai/v1/chat/completions',
        gemini: 'https://generativelanguage.googleapis.com/v1beta/models',
        claude: 'https://api.anthropic.com/v1/messages',
      };
      setLlmApiKey(savedConfig.apiKey);
      setLlmModel(savedConfig.model);
      setLlmApiUrl(providerApiUrls[savedConfig.provider] || '');
    }
  }, []);

  async function handleConvert() {
    if (!seleniumCode.trim()) {
      alert('Please enter Selenium code.');
      return;
    }
    if (!llmApiKey || !llmModel || !llmApiUrl) {
      alert('Please configure your LLM provider and API key first.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/convert/seleniumToPlaywright', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seleniumCode,
          llmApiKey,
          llmApiUrl,
          llmModel
        })
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
            <button
                style={{ marginTop: '10px', alignSelf: 'flex-end' }}
                onClick={() => {
                  navigator.clipboard.writeText(playwrightCode)
                      .then(() => alert('✅ Playwright code copied to clipboard!'))
                      .catch(() => alert('❌ Failed to copy code.'));
                }}
            >
              📋 Copy Code
            </button>
          </div>
        </div>
      </div>
  );
}

export default SeleniumToPlaywrightPage;
