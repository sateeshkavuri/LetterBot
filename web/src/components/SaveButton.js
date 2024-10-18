import React from 'react';
import './SaveButton.css';

function SaveButton() {
  const handleSave = () => {
    // Logic to save chat
  };

  return (
    <button className="save-button" onClick={handleSave}>
      Save
    </button>
  );
}

export default SaveButton;