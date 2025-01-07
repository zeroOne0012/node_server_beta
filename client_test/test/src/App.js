import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';

import ImageTest from './image_test';


const socketCAM1 = io('http://localhost:8000/room1');
const socketCAM2 = io('http://localhost:8000/room2');
const socketAnalysis = io('http://localhost:8000/room3');
const socketEncorder = io('http://localhost:8000/room4');

function App() {
  const [messages, setMessages] = useState([]);
  const [msges, setMsges] = useState([]);
  const [message, setMessage] = useState('');
  const [currentRoom, setCurrentRoom] = useState('CAM1');

  useEffect(() => {
    const selectedSocket = getCurrentSocket();
    
    selectedSocket.on('message', (data) => {
      console.log('Received message:', data);
      setMessages((prev) => [...prev, data.message]);
    });
    selectedSocket.on('msg', (data) => {
      console.log('Received message:', data);
      setMsges((prev) => [...prev, data.message]);
    });

    return () => {
      selectedSocket.off('message');
      selectedSocket.off('msg');
    };
  }, [currentRoom]);

  const getCurrentSocket = () => {
    switch (currentRoom) {
      case 'CAM1': return socketCAM1;
      case 'CAM2': return socketCAM2;
      case 'Analysis': return socketAnalysis;
      case 'Encorder': return socketEncorder;
      default: return socketCAM1;
    }
  };

  const sendMessage = () => {
    const selectedSocket = getCurrentSocket();
    selectedSocket.emit('message', JSON.stringify({ message }));
    setMessage('');
  };
  const sendMsg = () => {
    const selectedSocket = getCurrentSocket();
    selectedSocket.emit('msg', JSON.stringify({ message }));
    setMessage('');
  };

  return (
    <div className="App">
      <h1>WebSocket Test App</h1>
      <div>
        <label>Select Room:</label>
        <select onChange={(e) => setCurrentRoom(e.target.value)} value={currentRoom}>
          <option value="CAM1">CAM1</option>
          <option value="CAM2">CAM2</option>
          <option value="Analysis">Analysis</option>
          <option value="Encorder">Encorder</option>
        </select>
      </div>

      <div>
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Enter message" 
        />
        <button onClick={sendMessage}>Send Message</button>
        <button onClick={sendMsg}>Send Msg</button>
      </div>

      <div>
        <h2>Messages</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Msges</h2>
        <ul>
          {msges.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
      <ImageTest />
    </div>
  );
}

export default App;
