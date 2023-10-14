// Orders.jsx

'use client';
import React, { useEffect, useState } from 'react';
import { FaCommentAlt, FaCog, FaFolderOpen, FaTimes } from 'react-icons/fa';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '@/app/authentication/firebase';
import ChatBox from '@/app/Chat/Chat';

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
          (status === 'Closed' &&
            (issueNumber === '1' && userId === 'K3ZbPeRwRycr02lK9QNIw7KbHSu1')) ||
          (status === 'Closed' &&
            ((issueNumber === '2' || issueNumber === '3') &&
              userId === 'YwbQW9FbP4NziDU1yDOxuAzL2w52'))
        );
      })
      .map((doc) => ({ id: doc.id, ...doc.data() }));

    console.log('Fetched data:', data);
    return data;
  };



  const sortedData = [...userData].sort((a, b) => {
    const timeA = new Date(a.ClosedTime).getTime();
    const timeB = new Date(b.ClosedTime).getTime();
    const priorityA = parseInt(a.priority, 10);
    const priorityB = parseInt(b.priority, 10);

    if (sortByPriorityCheckbox) {
      return sortByPriority ? priorityB - priorityA : priorityA - priorityB;
    } else {
      return timeB - timeA;
    }
  });

 



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

  const DescriptionModal = ({ order, onClose, handleOpenChat }) => (
    <div className=" inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 mx-auto my-auto">

      <div className="relative max-w-2xl bg-white p-6  mx-auto">
        <h2 className="text-3xl font-bold mb-4">{`Ticket ID: ${order.id}`}</h2>
        <p className="text-gray-600 mb-2">{`Email: ${order.email}`}</p>
        <p className="text-gray-600 mb-2">{`Status: ${order.status}`}</p>
        <p className="text-gray-600 mb-2">{`Subject: ${order.subject}`}</p>
        <p className="text-gray-600 mb-2">{`Issues: ${order.Issue}`}</p>
        <p className="text-gray-800 mb-4">{`Description: ${order.description}`}</p>
  
        <div className="flex justify-center mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={() => handleOpenChat(order)}
          >
            Open Chat
          </button>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex justify-between px-4 pt-4">
        <h2>Tickets</h2>
      </div>
      <div className="p-4">
        {userData.length === 0 ? (
          <div className="justify-center text-gray-500">Loading...</div>
        ) : (
          <div className="w-full m-auto p-4 border space-y-3 rounded-lg bg-white overflow-y-auto">
            {sortedData.map((order) => (
              <div
                key={order.id}
                className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-4 border flex items-center justify-between cursor-pointer"
                onClick={() => handleOpenDescription(order)}
              >
                <div>
                  <div className="font-bold">{order.name}</div>
                  <div className="text-sm text-gray-500">
                    <span className="font-bold">Time:</span>{' '}
                    {new Date(order.ClosedTime).toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                
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
                    <DescriptionModal
                      order={selectedOrder}
                      onClose={handleCloseDescription}
                      handleOpenChat={handleOpenChat}
                    />
                    <button
                      className="text-blue-500 mt-2"
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

      {chatOpen && selectedOrder && (
        <ChatBox order={selectedOrder} onClose={handleCloseChat} />
      )}
    </div>
  );
};

export default Orders;
