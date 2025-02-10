'use client'

import { getUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

function Notificationpage() {

  const router = useRouter();
  
    useEffect(() => {
      const fetchUser = async () => {
        const userData = await getUser();
        if (!userData) router.push("/login");
      };
      fetchUser();
    }, []);

  const notifications = [
    {
      id: 1,
      message: "John Doe liked your post",
      time: "2h ago",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      message: "Jane Smith commented on your post",
      time: "4h ago",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      id: 3,
      message: "Tom Williams followed you",
      time: "6h ago",
      avatar: "https://randomuser.me/api/portraits/men/33.jpg"
    },
    {
      id: 4,
      message: "Emily Brown liked your post",
      time: "8h ago",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg"
    }
  ];

  return (
    <div className="container mx-auto p-4">
     
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold">Notifications</h2>
      </div>

    
      <div className="space-y-4">
        {notifications.map(notification => (
          <div key={notification.id} className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
            <img
              src={notification.avatar}
              alt="User Avatar"
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <p className="font-semibold">{notification.message}</p>
              <p className="text-gray-500 text-sm">{notification.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notificationpage;
