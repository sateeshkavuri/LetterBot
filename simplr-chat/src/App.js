import React, { useState } from 'react';
import './App.css'
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import myImage from './loading-green-loading.gif'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
const AWS = require('aws-sdk');

function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [editorText, setEditorText] = useState('<p>Hello, this is your text!</p>');
  const [loading, setLoading] = useState(false);

  

  const handleEditorChange = (value) => {
    setEditorText(value);
  };

  

  const handleSend = () => {
    if (message.trim()) {
      
        if (message.trim()) {
          setLoading(true);
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
            setLoading(false);
          })
          .catch(error => {
            console.error('Error:', error);
          });
        }
      };
      
      
      
    
  };

  const handleSaveToS3 = async () => {
    const s3 = new AWS.S3({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: process.env.REACT_APP_AWS_REGION,
    });

    const params = {
      Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
      Key: `chatHistory-${Date.now()}.txt`,
      Body: chatHistory.join('\n'),
      ContentType: 'text/plain',
    };

    try {
      await s3.upload(params).promise();
      alert('Chat history saved to S3 successfully!');
    } catch (error) {
      console.error('Error uploading to S3:', error);
      alert('Failed to save chat history to S3.');
    }
  };



  return (
    
    <div >
     
      <div className="editor-container">
      
        {chatHistory.map((message, index) => (
          
          <textarea className="message" rows="100" cols="300"         
          onChange={handleEditorChange}           
          >{message}</textarea>
        ))}
        
      </div>
      
     
      <div className="form-wrapper">
      <div id="message-form" className="message-form">
        <input type="text" name="message" 
         value={message}
         onChange={(e) => setMessage(e.target.value)}
          placeholder="Send a message..." className="message" id="message" />
        <button type="button" name="send" className="send" onClick={handleSend} >
        <FontAwesomeIcon icon="fa-regular fa-rocket-launch" />
          Send
        </button>
        <button type="button" className="send" onClick={handleSaveToS3}>Save<FontAwesomeIcon icon="fas fa-save" /></button>
        {loading && <img src={myImage} alt="Loading..." className="loading-image" />}
      </div>
        
      </div>
      
      </div>
      
  );
}

export default App;


