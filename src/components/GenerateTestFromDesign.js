import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

function GenerateTestFromDesign() {
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Updated method to Generate and Download
    const generateAndDownloadTestCases = async () => {
        if (!description.trim()) {
            alert('Please enter a description.');
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/design/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description })
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                alert('❌ Failed to generate test cases: ' + errorMsg);
                return;
            }

            const textData = await response.text();

            // 🎯 Create a Blob and trigger download
            const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'test_cases.txt';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            // ✅ Optional success notification
            alert('✅ Test cases generated and downloaded successfully!');
        } catch (err) {
            console.error(err);
            alert('❌ Error: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="main-content">
            <h2>Generate Test Cases from Design</h2>

            <div className="form-group">
                <label>Description / Ticket Details:</label>
                <textarea
                    rows="8"
                    style={{ width: '100%' }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Paste your ticket description here..."
                />
            </div>

            <button onClick={generateAndDownloadTestCases} disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate and Download Test Cases'}
            </button>

            {isLoading && <div className="loading-spinner"></div>}
        </div>
    );
}

export default GenerateTestFromDesign;
