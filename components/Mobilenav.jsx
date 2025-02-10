import { Home, Search, Bell, User, PlusCircle } from "lucide-react"; 
import Link from "next/link";
import React from "react";

function Mobilenav() {
  return (
    <div className="block lg:hidden fixed bottom-0 left-0 w-full bg-white shadow-md">
      <div className="flex justify-around items-center py-2">
    
        <Link href={'/home'}>
        <button className="flex flex-col items-center text-gray-600 hover:text-blue-500">
          <Home size={24} />
          <span className="text-xs">Home</span>
        </button>
        </Link>

      
       <Link href={'/search'}>
       <button className="flex flex-col items-center text-gray-600 hover:text-blue-500">
          <Search size={24} />
          <span className="text-xs">Search</span>
        </button>
       </Link>
      
       <Link href={'/createpost'}>
       <button className="flex flex-col items-center text-gray-600 hover:text-blue-500">
          <PlusCircle size={24} />
          <span className="text-xs">Post</span>
        </button>
       </Link>

       
       <Link href={'/notification'}>
       <button className="flex flex-col items-center text-gray-600 hover:text-blue-500">
          <Bell size={24} />
          <span className="text-xs">Notifications</span>
        </button>
       </Link>

       
       <Link href={'/profile'}>
       <button className="flex flex-col items-center text-gray-600 hover:text-blue-500">
          <User size={24} />
          <span className="text-xs">Profile</span>
        </button>
       </Link>
      </div>
    </div>
  );
}

export default Mobilenav;
