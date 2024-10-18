import React, { useState } from 'react';
import './InputBox.css';

function InputBox() {
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {
    // Logic to send message
    setMessage('');
  };

  return (
    <div className="input-box">
      <input
        type="text"
        value={message}
        onChange={handleChange}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default InputBox;