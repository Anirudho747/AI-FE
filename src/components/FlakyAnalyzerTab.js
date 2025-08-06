import React, { useState } from 'react';

function FlakyAnalyzerTab() {
    const [file, setFile] = useState(null);
    const [fileFormat, setFileFormat] = useState('csv');
    const [threshold, setThreshold] = useState(30);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleUpload = async () => {
        setErrorMessage('');

        if (!file || !fileFormat) {
            setErrorMessage('Please select a file and format.');
            return;
        }

        // ✅ Load LLM config from localStorage
        const savedConfig = JSON.parse(localStorage.getItem('llmConfig'));
        if (!savedConfig || !savedConfig.apiKey || !savedConfig.model || !savedConfig.provider) {
            setErrorMessage('⚠️ Missing LLM configuration. Please set it in the "Configure Your LLM" tab.');
            return;
        }

        const providerApiUrls = {
            openai: 'https://api.openai.com/v1/chat/completions',
            groq: 'https://api.groq.com/openai/v1/chat/completions',
            gemini: 'https://generativelanguage.googleapis.com/v1beta/models',
            claude: 'https://api.anthropic.com/v1/messages',
        };

        const llmApiUrl = providerApiUrls[savedConfig.provider];
        const llmApiKey = savedConfig.apiKey;
        const llmModel = savedConfig.model;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('format', fileFormat);
        formData.append('threshold', threshold);
        formData.append('llmApiUrl', llmApiUrl);
        formData.append('llmApiKey', llmApiKey);
        formData.append('llmModel', llmModel);

        try {
            setLoading(true);
            const res = await fetch('http://localhost:8080/flaky/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || 'Failed to analyze file.');
            }

            const data = await res.json();
            setResults(data);
        } catch (error) {
            console.error('Error analyzing flaky tests:', error);
            setErrorMessage('❌ Failed to analyze test file.');
        } finally {
            setLoading(false);
        }
    };

    const downloadSample = (type) => {
        window.open(`http://localhost:8080/flaky/sample/${type}`, '_blank');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <h2>🌟 Flaky Test Analyzer</h2>

            <div style={{ marginBottom: '20px' }}>
                <label>File Format:</label>
                <select
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value)}
                    style={{ marginLeft: '10px' }}
                >
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                </select>
                <button onClick={() => downloadSample(fileFormat)} style={{ marginLeft: '20px' }}>
                    Download Sample {fileFormat.toUpperCase()}
                </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label>Upload Test Run File:</label>
                <input
                    type="file"
                    accept={fileFormat === 'csv' ? '.csv' : '.json'}
                    onChange={(e) => setFile(e.target.files[0])}
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label>Flaky Threshold (%): {threshold}</label>
                <input
                    type="range"
                    min="25"
                    max="100"
                    step="5"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                />
            </div>

            <button onClick={handleUpload} disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze Flaky Tests'}
            </button>

            {errorMessage && (
                <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>
            )}

            {results?.flakyTests && (
                <div style={{ marginTop: '30px' }}>
                    <h3>🔢 Top Flaky Tests</h3>
                    <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
                        <thead>
                        <tr>
                            <th>Test Name</th>
                            <th>Fail Rate (%)</th>
                            <th>Failures</th>
                            <th>Runs</th>
                            <th>Suggestion</th>
                        </tr>
                        </thead>
                        <tbody>
                        {results.flakyTests.length > 0 ? (
                            results.flakyTests.map((entry, idx) => (
                                <tr key={idx}>
                                    <td>{entry.testName}</td>
                                    <td>{(entry.failRate * 100).toFixed(1)}</td>
                                    <td>{entry.failCount || '-'}</td>
                                    <td>{entry.totalRuns || '-'}</td>
                                    <td>{entry.suggestion || '...'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center' }}>
                                    No flaky tests above the threshold.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default FlakyAnalyzerTab;

