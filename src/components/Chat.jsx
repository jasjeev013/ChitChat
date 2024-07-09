import React, { useState, useEffect, useRef } from 'react';
import queryString from 'query-string';
import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import InfoBar from './InfoBar';
import Input from './Input';
import Messages from './Messages';
import TextContainer from './TextContainer';

const Chat = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'http://localhost:5000';
  const location = useLocation();
  const socketRef = useRef(null);

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socketRef.current = io(ENDPOINT);

    setName(name);
    setRoom(room);

    socketRef.current.emit('join', { name, room }, () => {});

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socketRef.current.on("roomData", ({ users }) => {
        setUsers(users);
      });

      return () => {
        socketRef.current.off('message');
      };
    }
  }, []);

  // Function for sending messages
  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socketRef.current.emit('sendMessage', message, () => setMessage(''));
    }
  };

  console.log(message, messages);

  return (
    <div className='outerContainer'>
      <div className='container'>

        <InfoBar room = {room} />
        <Messages messages = {messages}  name={name}/>
        <Input message = {message} setMessage = {setMessage} sendMessage ={sendMessage}/>
      
      </div>
      <TextContainer users= {users} />
    </div>
  );
};

export default Chat;
