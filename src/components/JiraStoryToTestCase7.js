// src/components/UserStoryToManualTestcasePage.js
import React, { useState } from 'react';
import AceEditor from 'react-ace';
import { FaExchangeAlt } from 'react-icons/fa';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/mode-gherkin'; // For BDD user stories
import 'ace-builds/src-noconflict/mode-text'; // For manual test cases

function JiraStoryToTestCase7() {
  const [userStory, setUserStory] = useState('');
  const [manualTestcase, setManualTestcase] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generationMessage, setGenerationMessage] = useState('');

  // Convert Jira Story to Test Case
  async function handleGenerateTestcase() {
    if (!userStory.trim()) {
      alert('Please enter a user story.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/generate/manualTestcase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userStory }),
      });

      if (!response.ok) {
        const errMsg = await response.text();
        alert('Generation failed: ' + errMsg);
        return;
      }

      const generated = await response.text();
      setManualTestcase(generated);
      setGenerationMessage('Manual test case generated successfully!');
    } catch (err) {
      console.error(err);
      setGenerationMessage('Error generating manual test case: ' + err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
      <div className="main-content">
        <h2>Jira Story to Test Case Generation</h2>
        <div className="editor-container">
          <div className="editor-wrapper">
            <h4>User Story (Gherkin)</h4>
            <AceEditor
                mode="gherkin"
                theme="textmate"
                name="userStoryEditor"
                width="100%"
                height="400px"
                fontSize={14}
                value={userStory}
                onChange={(newValue) => setUserStory(newValue)}
                editorProps={{ $blockScrolling: true }}
                setOptions={{ useWorker: false }}
            />
          </div>
          <div className="convert-icon" onClick={handleGenerateTestcase} title="Generate Test Case">
            <FaExchangeAlt size={30} color="#2c3e50" />
          </div>
          <div className="editor-wrapper">
            <h4>Generated Test Case</h4>
            <AceEditor
                mode="text"
                theme="textmate"
                name="TestcaseEditor"
                width="100%"
                height="400px"
                fontSize={14}
                value={manualTestcase}
                onChange={(newValue) => setManualTestcase(newValue)}
                editorProps={{ $blockScrolling: true }}
                setOptions={{ useWorker: false }}
            />
            <div style={{ marginTop: '10px' }}>
              <button onClick={handleGenerateTestcase} disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Manual Test Case'}
              </button>
            </div>
            <div className="message">{generationMessage}</div>
          </div>
        </div>
      </div>
  );
}

export default JiraStoryToTestCase7;

