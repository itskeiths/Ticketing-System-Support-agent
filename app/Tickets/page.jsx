"use client";
import React, { useEffect, useState } from 'react';
import { FaCommentAlt, FaCog, FaFolderOpen } from 'react-icons/fa';
import {collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db,auth } from '@/app/authentication/firebase';
import ChatBox from '@/app/Chat/Chat'
import { FaTimes } from 'react-icons/fa';

const Orders = () => {
  const [sortByPriority, setSortByPriority] = useState(false);
  const [userData, setUserData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [chatOpen, setChatOpen] = useState(null);
  const [sortByPriorityCheckbox, setSortByPriorityCheckbox] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const dataFromFirestore = await fetchDataFromFirestore();
      setUserData(dataFromFirestore);
    }

    fetchData();
  }, []);

  const fetchDataFromFirestore = async () => {
    const user = auth.currentUser;
    const uid = user?.uid;
    const querySnapshot = await getDocs(collection(db, 'Form'));
    const data = querySnapshot.docs
      .filter((doc) => {
        const issueNumber = doc.data().Issue;
        const userId = uid;
        const status = doc.data().status;
        return (
          (status === 'New' &&
            (issueNumber === '1' && userId === 'K3ZbPeRwRycr02lK9QNIw7KbHSu1')) ||
          (status === 'New' &&
            ((issueNumber === '2' || issueNumber === '3') &&
              userId === 'YwbQW9FbP4NziDU1yDOxuAzL2w52'))
        );
      })
      .map((doc) => ({ id: doc.id, ...doc.data() }));

    console.log('Fetched data:', data);
    return data;
  };

  const handleCloseTicket = async (orderId) => {
    try {
      const orderRef = doc(db, 'Form', orderId);
      await updateDoc(orderRef, {
        status: 'Processing',
        ProcessTime: new Date().toLocaleString(),
      });

      const updatedData = await fetchDataFromFirestore();
      setUserData(updatedData);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const sortedData = [...userData].sort((a, b) => {
    const timeA = new Date(a.time).getTime();
    const timeB = new Date(b.time).getTime();
    const priorityA = parseInt(a.priority, 10);
    const priorityB = parseInt(b.priority, 10);

    if (sortByPriorityCheckbox) {
      return sortByPriority ? priorityB - priorityA : priorityA - priorityB;
    } else {
      return timeB - timeA;
    }
  });

  const toggleSortByPriority = () => {
    setSortByPriorityCheckbox((prev) => !prev);
  };

  const handleOpenDescription = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDescription = () => {
    setSelectedOrder(null);
  };

  const handleOpenChat = (order) => {
    handleCloseDescription();
    setSelectedOrder(order);
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
  };

  const Description = ({ order, onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
    <div className="max-w-2xl bg-white p-6 rounded-md relative">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={() => onClose()}  
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
          onClick={() => handleOpenChat(order)}
        >
          <FaCommentAlt />
        </div>
      </div>
    </div>
  );

  return (
    <div className='bg-gray-100 min-h-screen'>
      <div className='flex justify-between px-4 pt-4'>
        <h2>Tickets</h2>
        <label className='cursor-pointer'>
          <input
            type='checkbox'
            checked={sortByPriorityCheckbox}
            onChange={toggleSortByPriority}
          />
          Priority
        </label>
      </div>
      <div className='p-4'>
        {userData.length === 0 ? (
          <div className='justify-center text-gray-500'>Loading...</div>
        ) : (
          <div className='w-full m-auto p-4 border space-y-3 rounded-lg bg-white overflow-y-auto'>
            {sortedData.map((order) => (
              <div
                key={order.id}
                className='bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-4 border flex items-center justify-between cursor-pointer'
                onClick={() => handleOpenDescription(order)}
              >
                <div>
                  <div className='font-bold'>{order.name}</div>
                  <div className='text-sm text-gray-500'>
                    <span className='font-bold'>Time:</span>{' '}
                    {new Date(order.time).toLocaleString()}
                  </div>
                </div>
                <div className='flex flex-col items-end gap-2'>
                  <button
                    className='cursor-pointer'
                    onClick={() => handleCloseTicket(order.id)}
                  >
                    Process
                  </button>
                  <div
                    className={`cursor-pointer text-blue-500 }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenChat(order);
                    }}
                  >
                    <FaFolderOpen />
                  </div>
                </div>
                {selectedOrder && selectedOrder.id === order.id && (
                  <div>
                    <Description order={selectedOrder} onClose={handleCloseDescription} />
                    <button
                      className='text-blue-500 mt-2'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseDescription();
                      }}
                    >
                      Close Description
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {chatOpen && selectedOrder && <ChatBox order={selectedOrder} onClose={handleCloseChat} />}
    </div>
  );
};

export default Orders;
