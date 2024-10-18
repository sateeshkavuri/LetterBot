import React, { useState } from 'react';
import './App.css'
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [editorText, setEditorText] = useState('<p>Hello, this is your text!</p>');

  const handleEditorChange = (value) => {
    setEditorText(value);
  };

  const handleSend = () => {
    if (message.trim()) {
      
        if (message.trim()) {
         
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
            if (jsonResponse && jsonResponse.content.length > 0){
              template = jsonResponse.content[0].text;
            }
            setChatHistory([...chatHistory, template]);
            setMessage('');
          })
          .catch(error => {
            console.error('Error:', error);
          });
        }
      };
      
      
      
    
  };

  const handleSave = () => {
    const blob = new Blob([chatHistory.join('\n')], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'chatHistory.txt';
    link.click();
  };

  return (
    <div >
      
      <div className="editor-container">
        
        {chatHistory.map((message, index) => (
         
          <ReactQuill
          value={message}
          onChange={handleEditorChange}
           theme="snow"
        />
        ))}
        
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


