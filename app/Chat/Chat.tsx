'use client';
import React, { useState, useEffect, useRef, Key } from 'react';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db,auth} from '@/app/authentication/firebase';

interface ChatBoxProps {
  order: {
    userId: string;
    name: string;
    priority: string;
    subject: string;
    addedTime: string;
    status: string;
    description:string,
    Issue: string;
    id:string,
  
  };
  onClose: () => void;

}

interface Message {
  id: Key | null | undefined;
  message: string;
  timestamp: string;
  userId: string;
  userName :string
}

interface User {
  userId: string;
  userName:string
}







const ChatBox: React.FC<ChatBoxProps> = ({ onClose, order }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  let userId=' ';
  const user = auth.currentUser;
  const uid = user?.uid;
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const userData: User = {
        userId: order.userId,
        userName: uid=="YwbQW9FbP4NziDU1yDOxuAzL2w52"?'Admin2':'Admin1',
      };
      setCurrentUser(userData);
    };

    fetchCurrentUser();
  }, [order.userId]);

  useEffect(() => {
    if (!order.userId) return;

    const chatCollection = collection(db, 'chat');

    const unsubscribeChat = onSnapshot(chatCollection, (snapshot) => {
       const sortedMessages= snapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id } as Message))
          .filter((message) => {
            return (
              (message.userId === currentUser?.userId || message.userName === 'Admin') &&
              (message.userName !== 'Admin' || message.userId === order.userId)
            );
          }     
      )   
      .sort((a, b) => {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });
      setMessages(sortedMessages);

     });

    return () => {
      unsubscribeChat();
    };
  }, [order.userId, currentUser?.userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !currentUser) return;

    try {
      const chatCollection = collection(db, 'chat');
      await addDoc(chatCollection, {
        message: newMessage,
        timestamp: new Date().toLocaleString(),
        userId: currentUser.userId,
        userName:uid=="YwbQW9FbP4NziDU1yDOxuAzL2w52"?'Admin2':'Admin1'
      })
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-0 right-0 bg-white border-l border-t border-gray-300 p-4 w-80 h-96 overflow-y-auto">
      <div className="flex justify-between mb-4">
        <h1>{userId}</h1>
        <h2>Chat</h2>
        <button onClick={onClose}>&times;</button>
      </div>
      <div className="messages">
        {messages.map((message) => (
           <div
           key={message.id}
           className={`mb-2 text-white p-2 rounded-lg ${
             (message.userName === 'Admin2' || message.userName=='Admin1') && currentUser?.userId === message.userId 
               ? 'bg-green-500 ml-2'
               :'bg-blue-500 mr-2 self-end'
           }`}
         >
   
   {message.userId === currentUser?.userId && (message.userName === 'Admin1' || message.userName === 'Admin2') ? (
  <strong>You:</strong>
) : (
  <strong>User:</strong>
)} {message.message}

         </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          className="border rounded p-2 w-3/4"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg ml-2"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;