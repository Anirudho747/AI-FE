import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

function GenerateTestFromDesign() {
    const [description, setDescription] = useState('');
    const [bddOutput, setBddOutput] = useState('');
    const [tddOutput, setTddOutput] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!description.trim()) {
            setErrorMessage('Please enter a screen description.');
            return;
        }

        setLoading(true);
        setErrorMessage('');
        setBddOutput('');
        setTddOutput('');

        try {
            const response = await fetch('http://localhost:8080/api/design/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description }),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            const result = await response.json();
            setBddOutput(result.bdd || '');
            setTddOutput(result.tdd || '');
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage(error.message || 'Failed to generate test cases.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (content, filename) => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="container" style={{ marginBottom: '200px' }}>
            <h2>Generate Tests from Jira Story</h2>

            <div style={{ marginBottom: '20px' }}>
                <label>Screen Description:</label>
                <textarea
                    rows={6}
                    style={{ width: '100%' }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="E.g., User sees a login form with username, password and login button..."
                />
            </div>

            <button
                style={{ width: '100%', height: '40px' }}
                onClick={handleGenerate}
                disabled={loading}
            >
                {loading ? 'Generating...' : 'Generate Test Cases'}
            </button>

            {errorMessage && (
                <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>
            )}

            {bddOutput && (
                <>
                    <h3>🟩 BDD Style Output:</h3>
                    <pre style={{ background: '#f4f4f4', padding: '10px' }}>{bddOutput}</pre>
                    <button
                        style={{ marginRight: '10px' }}
                        onClick={() => handleDownload(bddOutput, 'BDD_TestCases.txt')}
                    >
                        📥 Download BDD Test Cases
                    </button>
                </>
            )}

            {tddOutput && (
                <>
                    <h3>🧪 TDD Style Output (JUnit):</h3>
                    <pre style={{ background: '#f4f4f4', padding: '10px' }}>{tddOutput}</pre>
                    <button onClick={() => handleDownload(tddOutput, 'TDD_TestCases.java')}>
                        📥 Download TDD Test Cases
                    </button>
                </>
            )}
        </div>
    );
};

export default GenerateTestFromDesign;
