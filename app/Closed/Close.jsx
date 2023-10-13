'use client';
import React, { useEffect, useState } from 'react';
import { FaCommentAlt, FaCog, FaFolderOpen } from 'react-icons/fa';
import { BsSortDown } from 'react-icons/bs';
import {collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db,auth } from '@/app/authentication/firebase';
import Description from '@/app/Description/page';
import { useRouter } from 'next/navigation';
import ChatBox from '../Chat/Chat';


const Orders = () => {
  const [sortByPriority, setSortByPriority] = useState(false);
  const [userData, setUserData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [chatOpen, setChatOpen] = useState(null);
  const [sortByPriorityCheckbox, setSortByPriorityCheckbox] = useState(false);
  const router = useRouter();

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
        .filter(doc => {
            const issueNumber = doc.data().Issue;
            const userId = uid; 
            const status = doc.data().status;
            return (status=='Closed' && (issueNumber === '1' && userId === 'K3ZbPeRwRycr02lK9QNIw7KbHSu1') ||
                (status=='Closed' && ((issueNumber === '2' || issueNumber === '3') && userId === 'YwbQW9FbP4NziDU1yDOxuAzL2w52')) );
        })
        .map(doc => ({ id: doc.id, ...doc.data() }));

    console.log('Fetched data:', data);
    return data;
};



  const sortedData = [...userData]
  .sort((a, b) => {
    const timeA = new Date(a.CloseTime).getTime();
    const timeB = new Date(b.CloseTime).getTime();
    const priorityA = parseInt(a.priority, 10);
    const priorityB = parseInt(b.priority, 10);

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

  return (
    <div className='bg-gray-100 min-h-screen'>
      <div className='flex justify-between px-4 pt-4'>
        <h2>Tickets</h2>
      </div>
      <div className='p-4'>
      {userData.length === 0 ? (
          <div className='justify-center text-gray-500'>Loading...</div>
        ) : (
        <div className='w-full m-auto p-4 space-y-3 border rounded-lg bg-white overflow-y-auto'>
          {sortedData.map((order) => (
            (
              <div
                key={order.id}
                className='bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-4 border flex items-center justify-between cursor-pointer'
                onClick={() => handleOpenDescription(order)}
              >
                <div>
                  <div className='font-bold'>{order.name}</div>
                  <div className='text-sm text-gray-500'>
                    <span className='font-bold'>Time:</span>{' '}
                    {new Date(order.CloseTime).toLocaleString()}
                  </div>
                </div>
                <div className='flex flex-col items-end gap-2'>
                
                  <div
                    className='cursor-pointer text-blue-500'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenChat(order);
                    }}
                  >
                    <FaFolderOpen />
                  </div>
                </div>
              </div>
            )
          ))}
          {selectedOrder && (
            <Description order={selectedOrder} onClose={handleCloseDescription} />
          )}
        </div>
        )}
      </div>

      {chatOpen && selectedOrder && <ChatBox order={selectedOrder} onClose={handleCloseChat} />}
    </div>
  );
};

export default Orders;
