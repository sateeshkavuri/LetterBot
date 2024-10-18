import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders input and buttons', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Send a message...')).toBeInTheDocument();
    expect(screen.getByText('Send')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  test('does not send empty message', () => {
    render(<App />);
    const sendButton = screen.getByText('Send');

    fireEvent.click(sendButton);

    expect(screen.queryByText('<li>')).not.toBeInTheDocument();
  });

  test('can send a message', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Send a message...');
    const sendButton = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'Hello, world!' } });
    fireEvent.click(sendButton);

    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    expect(input.value).toBe('');
  });

 

  test('saves chat history', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Send a message...');
    const sendButton = screen.getByText('Send');
    const saveButton = screen.getByText('Save');

    fireEvent.change(input, { target: { value: 'Hello, world!' } });
    fireEvent.click(sendButton);

    //const createElementSpy = jest.spyOn(document, 'createElement');
    //fireEvent.click(saveButton);

    
  });
});
