"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function Searchpage() {

  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const router = useRouter();
  
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("id, username, avatar_url");
      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserClick = (userId) => {
    router.push(`/profile?userId=${userId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for users..."
            className="w-full p-3 pl-10 border-2 border-gray-300 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
        </div>
      </div>

      {filteredUsers.length > 0 && searchQuery ? (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserClick(user.id)}
              className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer hover:bg-gray-100 transition"
            >
              <img src={user.avatar_url} alt="User Avatar" className="w-12 h-12 object-cover rounded-full" />
              <div>
                <p className="font-semibold">{user.username}</p>
                <p className="text-gray-500 text-sm">@{user.username.split(" ").join("").toLowerCase()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-6">No users found</p>
      )}
    </div>
  );
}

export default Searchpage;
