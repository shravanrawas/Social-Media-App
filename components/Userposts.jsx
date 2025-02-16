"use client";

import React, { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";
import { LoaderCircle, Trash, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

function Userposts({ userId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      const userData = await getUser();
      if (!userData) return;

      setUser(userData);

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", userId || userData.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data);
      }

      setLoading(false);
    };

    fetchUserPosts();
  }, []);

  const handleDelete = async (postId) => {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) {
      console.error("Error deleting post:", error);
    } else {
      setPosts(posts.filter((post) => post.id !== postId));
      setSelectedPost(null);
    }
  };

  if (loading)
    return (
      <p className="flex w-full justify-center items-center">
        <LoaderCircle className="animate-spin" />
      </p>
    );

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {posts.length > 0 ? (
          posts.map((post) => (
            <img
              key={post.id}
              src={post.image_url}
              alt="User Post"
              className="w-full h-40 object-cover cursor-pointer rounded-lg"
              onClick={() => setSelectedPost(post)}
            />
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">No posts found</p>
        )}
      </div>

      {selectedPost && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-lg p-6 relative w-[500px] h-[600px]">
            <button
              className="absolute top-2 right-2 bg-gray-300 p-1 rounded-full"
              onClick={() => setSelectedPost(null)}
            >
              <X size={18} className="text-gray-700" />
            </button>

            <img
              src={selectedPost.image_url}
              alt="Selected Post"
              className="w-full h-[450px] object-cover rounded-lg"
            />

            <p className="mt-2 text-center font-semibold text-gray-800">
              {selectedPost.title}
            </p>

            {(!userId || userId == user.id) && (
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => handleDelete(selectedPost.id)}
                  className="flex bg-red-500 p-4 rounded-sm items-center space-x-1 text-white"
                >
                  <Trash size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Userposts;
