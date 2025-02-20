// src/components/PushCodeModal.js
import React, { useEffect, useState } from 'react';

function PushCodeModal({ isOpen, onClose, onPush }) {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [commitMessage, setCommitMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Fetch branches from backend when modal opens
      fetch('http://localhost:8080/api/github/branches')
        .then((res) => res.json())
        .then((data) => {
          setBranches(data);
          if (data.length > 0) {
            setSelectedBranch(data[0]); // default to first branch
          }
        })
        .catch((err) => console.error('Error fetching branches:', err));
    }
  }, [isOpen]);

  const handlePush = () => {
    if (!selectedBranch || !commitMessage) {
      alert('Please select a branch and enter a commit message.');
      return;
    }
    onPush(selectedBranch, commitMessage);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Push Code to GitHub</h3>
        <label>
          Select Branch:
          <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
            {branches.map((branch) => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Commit Message:
          <input
            type="text"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
          />
        </label>
        <div className="modal-buttons">
          <button onClick={handlePush}>Push Code</button>
          <button onClick={onClose} style={{ marginLeft: '10px' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default PushCodeModal;
