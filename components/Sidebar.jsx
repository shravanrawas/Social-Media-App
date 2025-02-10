"use client";

import { getUser, signOut } from "@/lib/auth";
import { Bell, Home, LogOut, PlusCircle, Search, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Sidebar() {
  const router = useRouter();
  const [user, setUser] = useState();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  return (
    <div className="w-72 bg-white border-r hidden md:block border-gray-200 p-6">
      <div className="space-y-4">
        <div className="text-2xl font-semibold text-blue-500">
          <Link href={"/"}>
            <span>Socialo</span>
          </Link>
        </div>

        <div className="space-y-2">
          <Link href={"/home"}>
            <button className="flex items-center space-x-3 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-full w-full">
              <Home size={20} />
              <span>Home</span>
            </button>
          </Link>

          <Link href={"/search"}>
            <button className="flex items-center space-x-3 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-full w-full">
              <Search size={20} />
              <span>Search</span>
            </button>
          </Link>

          <Link href={"/createpost"}>
            <button className="flex items-center space-x-3 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-full w-full">
              <PlusCircle size={20} />
              <span>Post</span>
            </button>
          </Link>

          <Link href={"/notification"}>
            <button className="flex items-center space-x-3 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-full w-full">
              <Bell size={20} />
              <span>Notifications</span>
            </button>
          </Link>

          <Link href={"/profile"}>
            <button className="flex items-center space-x-3 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-full w-full">
              <User size={20} />
              <span>Profile</span>
            </button>
          </Link>

          {user && (
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-3 text-red-500 hover:bg-red-200 px-4 py-2 rounded-full w-full"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
