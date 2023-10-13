'use client';
import React, { useState } from 'react'
import Link from 'next/link'
import {MdDashboard} from 'react-icons/md'
import styles from './SideBar.module.css'
import { MdOutlineKeyboardArrowLeft} from 'react-icons/md'
 
const sideBarItems =[
    {
        name:"Open",
        href:'./open',
        icon:' '
    },
    {
        name:"Pending",
        href:'',
        icon:' '
    },
    {
        name:"Hold",
        href:'',
        icon:' '
    },
    {
        name:"Sent",
        href:'',
        icon:' '
    },
    {
        name:"Hold",
        href:'',
        icon:' '
    },
];

const Admin = () => {
    const [isCollapsedSidebar,setIsCollapsedSidebar]  = useState<boolean>(false);
      
    const toogleSidebarCollapseHandler =() =>{
        setIsCollapsedSidebar((prev)=>!prev)
    }
  return (

        <div className={`${styles.sideBarWrapper} ${isCollapsedSidebar ? styles.collapsed : ''}`}>
      <button className={styles.sideButton} onClick={toogleSidebarCollapseHandler}>
        <MdOutlineKeyboardArrowLeft />
      </button>
      {/* Sidebar content goes here */}

        <aside className={styles.sideBar} data-Collapse={isCollapsedSidebar}>
            {/* <div className={styles.sideBarTop}>
                 <img src="/favicon.ico"
                 className={styles.sideBarLogo}
                 width={80}
                 height={80}
                  alt="" />
            </div> */}
            <ul className={ `${styles.sideBarWrapper} ${isCollapsedSidebar ? styles.collapsed : ''} ${styles.sideBarList}`}>
              {sideBarItems.map(({name,href,icon:Icon})=>(
                <li className='sideBarItem' key={name}>
                    <Link href={href} className={styles.sideBarLink}>
                        {/* <span className={styles.sideBarIcon}>
                             <Icon/>
                        </span> */}
                        <span className={styles.sideBarName}>{name}</span>
                    </Link>
                </li>
              ))}

            </ul>
            </aside>
    </div>
  )
}

export default Admin