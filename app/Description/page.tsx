"use client";
import React, { useState } from 'react';
import { FaTimes, FaCommentAlt } from 'react-icons/fa';
import { db } from '@/app/authentication/firebase';
import ChatBox from '@/app/Chat/Chat';  

interface DescriptionProps {
  order: {
    id: string;
    name: string;
    priority: string;
    subject: string;
    addedTime: string;
    status: string;
    description: string;
    userId:string,
    Issue:string,
    issues:string,
    email:string
  };
  onClose: () => void;
}

export default function Description({ order, onClose}:DescriptionProps) {
  const [isChatOpen, setChatOpen] = useState(false);

  const handleOpenChat = () => {
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="max-w-2xl bg-white p-6 rounded-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        <h2 className="text-3xl font-bold mb-4">{`Ticket ID: ${order.id}`}</h2>
        <p className="text-gray-600 mb-2">{`Email: ${order.email}`}</p>
        <p className="text-gray-600 mb-2">{`Status: ${order.status}`}</p>
        <p className="text-gray-600 mb-2">{`Subject: ${order.subject}`}</p>
        <p className="text-gray-600 mb-2">{`Issues: ${order.Issue}`}</p>
        <p className="text-gray-800 mb-4">{`Description: ${order.description}`}</p>
        
        <div
          className="fixed bottom-4 right-4 cursor-pointer text-blue-500"
          onClick={handleOpenChat}
        >
          <FaCommentAlt />
        </div>


        {isChatOpen && (
          <ChatBox order={order} onClose={handleCloseChat} />
        )}
      </div>
    </div>
  );
};