import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function App() {
  const [message, setMessage] = useState('');
  const [displayedMessages, setDisplayedMessages] = useState([]); // Separate state for displayed messages
  const [loading, setLoading] = useState(false); // New loading state

  const handleEditorChange = (value,index) => {
    // setEditorText(value);
    const newDisplayedMessages = displayedMessages;
    newDisplayedMessages[index] = value;
    setDisplayedMessages(newDisplayedMessages);
  };

  const handleSend = () => {
    if (message.trim()) {
      setLoading(true); // Start spinner
      setDisplayedMessages([]);
      axios.post('https://x7edkhpsp5.execute-api.us-east-1.amazonaws.com/new/modelapi', {
        promt: message
      }, {
        headers: {
          'Content-Type': 'application/json',
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
          "Access-Control-Allow-Methods": "POST,OPTIONS",
          'Access-Control-Allow-Credentials': true,
        }
      })
      .then(response => {
        const jsonResponse = JSON.parse(response.data.body);
        let template = message;
        if (jsonResponse && jsonResponse.content.length > 0) {
          template = jsonResponse.content[0].text;
        }
        setDisplayedMessages([...displayedMessages, template]); // Update displayed messages
        setMessage('');
      })
      .catch(error => {
        console.error('Error:', error);
      })
      .finally(() => {
        setLoading(false); // Stop spinner
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleSave = () => {
    const blob = new Blob([displayedMessages.join('\n')], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'displayedMessages.txt';
    link.click();
  };

  const handleClearDisplay = () => {
    setDisplayedMessages([]); // Clear only the displayed messages
  };

  return (
    <div className="root-container">
      <div className="editor-container">
        {displayedMessages.map((message, index) => (
          <ReactQuill
            value={message}
            onChange={(value, index) => handleEditorChange(value, index)}
            theme="snow"
            key={index} // Added key to avoid warnings
          />
        ))}
      </div>
      <div className="form-wrapper">
 
        <div id="message-form" className="message-form">
          <input
            type="text"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Send a message..."
            className="message"
            id="message"
          />
          <button type="button" name="send" className="send" onClick={handleSend}>
            <i className="fas fa-paper-plane"></i> Send
          </button>
          <button type="button" className="send" onClick={handleSave}>Save</button>
          <button type="button" className="send" onClick={handleClearDisplay}>Clear</button> {/* Clear display button */}
        </div>
        {loading && <div className="spinner"></div>} {/* Spinner element */}
      </div>
    </div>
  );
}

export default App;
