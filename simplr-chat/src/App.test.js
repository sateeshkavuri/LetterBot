import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';
import axios from 'axios';
import AWS from 'aws-sdk';

jest.mock('axios');
jest.mock('aws-sdk');

describe('App Component', () => {
  beforeEach(() => {
    AWS.S3.mockImplementation(() => ({
      getObject: jest.fn().mockReturnThis(),
      listObjectsV2: jest.fn().mockReturnThis(),
      upload: jest.fn().mockReturnThis(),
      promise: jest.fn(),
    }));
  });

  test('renders App component', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Send a message...')).toBeInTheDocument();
  });

  test('sends a message and updates chat history', async () => {
    axios.post.mockResolvedValue({
      data: {
        body: JSON.stringify({
          content: [{ text: 'Response from API' }],
        }),
      },
    });

    render(<App />);
    const input = screen.getByPlaceholderText('Send a message...');
    const sendButton = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    await waitFor(() => expect(screen.getByText('Response from API')).toBeInTheDocument());
  });

  test('fetches and displays S3 files', async () => {
    AWS.S3.prototype.listObjectsV2().promise.mockResolvedValue({
      Contents: [{ Key: 'file1.txt' }, { Key: 'file2.txt' }],
    });

    render(<App />);

    await waitFor(() => expect(screen.getByText('file1.txt')).toBeInTheDocument());
    expect(screen.getByText('file2.txt')).toBeInTheDocument();
  });

  test('handles file click and updates chat history', async () => {
    AWS.S3.prototype.getObject().promise.mockResolvedValue({
      Body: Buffer.from('File content from S3'),
    });

    render(<App />);

    await waitFor(() => expect(screen.getByText('file1.txt')).toBeInTheDocument());

    fireEvent.click(screen.getByText('file1.txt'));

    await waitFor(() => expect(screen.getByDisplayValue('File content from S3')).toBeInTheDocument());
  });

  test('clears chat history', () => {
    render(<App />);
    const clearButton = screen.getByText('clean');

    fireEvent.click(clearButton);

    expect(screen.queryByDisplayValue('File content from S3')).not.toBeInTheDocument();
  });

  test('saves chat history to S3', async () => {
    AWS.S3.prototype.upload().promise.mockResolvedValue({});

    render(<App />);
    const saveButton = screen.getByText('Save');

    fireEvent.click(saveButton);

    await waitFor(() => expect(screen.getByText('Chat history saved to S3 successfully!')).toBeInTheDocument());
  });
});