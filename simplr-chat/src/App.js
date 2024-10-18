import React, { useState } from 'react';
import './App.css'

function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSend = () => {
    if (message.trim()) {
      setChatHistory([...chatHistory, message]);
      setMessage('');
    }
  };

  const handleSave = () => {
    const blob = new Blob([chatHistory.join('\n')], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'chatHistory.txt';
    link.click();
  };

  return (
    <div className="chat-wrapper">
      
      <div className="chat-message">
        <ul>
        {chatHistory.map((message, index) => (
          <li key={index}>
            {message}
          </li>
        ))}
        </ul>
      </div>
      <div className="form-wrapper">
      <div id="message-form" className="message-form">
        <input type="text" name="message" 
         value={message}
         onChange={(e) => setMessage(e.target.value)}
          placeholder="Send a message..." className="message" id="message" />
        <button type="button" name="send" className="send" onClick={handleSend} >
         <i class="fas fa-paper-plane"></i>  
          Send
        </button>
        <button type="button" className="send" onClick={handleSave}>Save</button>
      </div>
        
      </div>
      </div>
  );
}

export default App;


