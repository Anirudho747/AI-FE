// ConfigurationTab.js
import React, { useState, useEffect } from 'react';

const providerModelMap = {
    openai: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'],
    groq: ['mixtral-8x7b', 'llama3-70b', 'gemma-7b'],
    gemini: ['gemini-pro', 'gemini-pro-vision'],
    claude: ['claude-3-opus', 'claude-3-sonnet'],
};

const providerConfig = {
    openai: {
        apiUrl: 'https://api.openai.com/v1/chat/completions'
    },
    groq: {
        apiUrl: 'https://api.groq.com/openai/v1/chat/completions'
    },
    gemini: {
        apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models'
    },
    claude: {
        apiUrl: 'https://api.anthropic.com/v1/messages'
    },
};

function ConfigurationTab({ onSave }) {
    const [provider, setProvider] = useState('');
    const [model, setModel] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    // Load saved config on mount
    useEffect(() => {
        const savedConfig = localStorage.getItem('llmConfig');
        if (savedConfig) {
            const { provider, model, apiKey } = JSON.parse(savedConfig);
            setProvider(provider);
            setModel(model);
            setApiKey(apiKey);
            setIsSaved(true);
        }
    }, []);

    useEffect(() => {
        setModel('');
        setApiKey('');
    }, [provider]);

    const handleSave = () => {
        if (!provider || !model || !apiKey) {
            alert('Please select provider, model, and enter API key.');
            return;
        }
        const config = {
            provider,
            model,
            apiKey
        };
        localStorage.setItem('llmConfig', JSON.stringify(config));
        setIsSaved(true);
        if (onSave) onSave(config);
        alert('✅ Configuration saved successfully!');
    };

    const handleReset = () => {
        localStorage.removeItem('llmConfig');
        setProvider('');
        setModel('');
        setApiKey('');
        setIsSaved(false);
        alert('🔄 Configuration reset.');
    };

    return (
        <div className="container" style={{maxWidth: '600px'}}>
            <h2>LLM Configuration</h2>

            {isSaved && (
                <div style={{color: 'green', marginBottom: '10px'}}>
                    ✅ A configuration is already saved.
                </div>
            )}

            <div style={{marginBottom: '20px'}}>
                <label>Select Provider</label>
                <select
                    style={{width: '120%', height: '40px'}}
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                >
                    <option value="" disabled>Choose provider</option>
                    {Object.keys(providerModelMap).map(p => (
                        <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                    ))}
                </select>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label>Select Model</label>
                <select
                    style={{width: '120%', height: '40px'}}
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    disabled={!provider}
                >
                    <option value="" disabled>Choose model</option>
                    {providerModelMap[provider]?.map((m) => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
            </div>

            {provider && (
                <div style={{marginBottom: '20px'}}>
                    <label>{provider.charAt(0).toUpperCase() + provider.slice(1)} API Key</label>
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder={`Enter your ${provider} API key`}
                        style={{width: '120%', height: '30px'}}
                    />
                </div>
            )}

            <div style={{display: 'flex', gap: '10px'}}>
                <button style={{width: '60%', height: '40px'}} onClick={handleSave}>
                    Save Configuration
                </button>
                <button style={{width: '40%', height: '40px'}} onClick={handleReset}>
                    Reset
                </button>
            </div>
        </div>
    );
}

export default ConfigurationTab;