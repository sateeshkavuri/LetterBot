import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import myImage from './loading-green-loading.gif'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
const AWS = require('aws-sdk');

function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [editorText, setEditorText] = useState('<p>Hello, this is your text!</p>');
  const [loading, setLoading] = useState(true);
  const [s3Files, setS3Files] = useState([]);
  const s3 = new AWS.S3({
    
  });

  const clearChatHistory = () => {
    setChatHistory([]);
  };

  const handleFileClick = async (fileName) => {
    

    const params = {
      Bucket: 'discovertrainingdata',
      Key: fileName,
    };

    try {
      setLoading(true);
      clearChatHistory();
      const data = await s3.getObject(params).promise();
      let fileContent = data.Body.toString('utf-8');
      
      // Convert newlines to <p></p> tags for proper paragraph formatting
      const formattedContent = fileContent
        .split('\n')
        .map(line => `<p>${line}</p>`)
        .join('');

      setChatHistory([formattedContent]); // Store the formatted content in chatHistory
      setLoading(false);
    } catch (error) {
      console.error('Error fetching file from S3:', error);
      setLoading(false);
    }
  };

  const fetchS3Files = async () => {
   

    const params = {
      Bucket: 'discovertrainingdata',
    };

    try {
      setLoading(true);
      const data = await s3.listObjectsV2(params).promise();
      const fileNames = data.Contents.map(file => file.Key);
      setS3Files(fileNames);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching S3 files:', error);
      setLoading(false);
    }
  };

  const handleEditorChange = (value) => {
    setEditorText(value);
  };

  const handleSend = () => {
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
        if (jsonResponse && jsonResponse.content.length > 0) {
          template = jsonResponse.content[0].text;
        }
        setChatHistory([...chatHistory, template]);
        setMessage('');
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setMessage('');
        setLoading(false);
      });
    }
  };

  const handleSaveToS3 = async () => {
    
    const name = prompt("Please enter your name:");
    if (!name) {
      alert('Name is required to save the chat history.');
      setLoading(false);
      return;
    }

    // Add the name to the beginning of the chat history
    const chatHistoryWithName = [`Name: ${name}`, ...chatHistory];

    const params = {
      Bucket: 'discovertrainingdata',
      Key: `${name}-${Date.now()}.txt`,
      Body: chatHistory.join('\n'),
      ContentType: 'text/plain',
    };

    try {
      setLoading(true);
      await s3.upload(params).promise();
      alert('Chat history saved to S3 successfully!');
      setLoading(false);
      fetchS3Files();
    } catch (error) {
      console.error('Error uploading to S3:', error);
      alert('Failed to save chat history to S3.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchS3Files();
  }, []);

  return (
    <div className='root-container'>
      <div className="editor-container">
        {chatHistory.map((message, index) => (
          <ReactQuill
            key={index}
            value={message} // Display the content fetched from S3
            onChange={handleEditorChange}
            theme="snow"
            readOnly={false} // Make ReactQuill editable
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
            placeholder="Send a message..." 
            className="message" 
            id="message" 
          />
          <button type="button" name="send" className="send" onClick={handleSend}>
            Send
          </button>
          <button type="button" className="send" onClick={handleSaveToS3}>Save</button>
          <button type="button" className="send" onClick={clearChatHistory}>Clear</button>
        </div>
        {loading && <div className="spinner"></div>}
      </div>
      <div className="s3-files">
        <h3>Template Files</h3>
        <table className="file-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {s3Files.map((file, index) => (
              <tr key={index}>
                <td>
                  <a onClick={() => handleFileClick(file)}>{file}</a>
                </td>
                <td>
                  <button 
                    type="button" 
                    className="rounded-button" 
                    onClick={() => handleFileClick(file)}>
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
