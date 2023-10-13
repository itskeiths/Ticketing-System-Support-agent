'use client';

import React, { useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import Open from '../Tickets/page';
import Reports from '../Report/page.jsx';
import { AiOutlineMail } from 'react-icons/ai';
import { BsGraphUp } from 'react-icons/bs';
import { IoTicketSharp } from 'react-icons/io5';
import { LiaRecycleSolid } from 'react-icons/lia';
import { LuFolderClosed } from 'react-icons/lu';
import Hold from '@/app/Hold/Hold';
import Closed from '@/app/Closed/Close';

const sideBarItems = [
  {
    name: 'New',
    icon: <IoTicketSharp />,
    component: <Open />,
  },
  {
    name: 'Hold',
    icon: <LiaRecycleSolid />,
    component: <Hold />,
  },
  {
    name: 'Closed',
    icon: <LuFolderClosed />,
    component: <Closed />,
  },
  {
    name: 'Report Tracking',
    icon: <BsGraphUp />,
    component: <Reports />,
  },
];

const Dashboard: React.FC = () => {
  const [profile, setName] = useState('Dashboard');
  const [isCollapsedSidebar, setIsCollapsedSidebar] = useState<boolean>(false);
  const [selectedComponent, setSelectedComponent] = useState<React.ReactNode | null>(<Open />);

  const toggleSidebar = () => {
    setIsCollapsedSidebar((prev) => !prev);
  };

  const handleItemClick = (component: React.ReactNode) => {
    setSelectedComponent(component);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`${
          isCollapsedSidebar ? 'hidden' : 'block'
        } w-64 bg-gray-800 text-white transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-center p-8">
          <img src="favicon.ico" alt="Avatar" className="w-16 h-16 rounded-full" />
          <div className="ml-4">
            <div className="font-semibold">{profile}</div>
          </div>
        </div>
        <aside className="p-4">
          <ul>
            {sideBarItems.map(({ name, icon: Icon, component }) => (
              <li key={name} className="mb-2">
                <button
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  onClick={() => handleItemClick(component)}
                >
                  <span className="mr-2">{Icon}</span>
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center bg-white p-4 shadow">
          <button className="w-6 h-6 text-gray-700" onClick={toggleSidebar}>
            <AiOutlineMenu />
          </button>
          <div className="font-semibold hidden md:flex">Admin Panel</div>
        </div>
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-4">
          {selectedComponent}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
