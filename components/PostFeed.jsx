"use client";

import { useEffect, useState } from "react";
import { Send, Heart, Share, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";


function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCommentInput, setShowCommentInput] = useState({});
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data: postsData, error } = await supabase
      .from("posts")
      .select("id, user_id, title, image_url, created_at");

    if (error) {
      console.error("Error fetching posts:", error);
      return;
    }

    const postsWithUsers = await Promise.all(
      postsData.map(async (post) => {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("username, avatar_url")
          .eq("id", post.user_id)
          .single();

        if (userError) {
          console.error("Error fetching user:", userError);
          return { ...post, user: { name: "Unknown", avatar_url: "" } };
        }

        return { ...post, user: userData };
      })
    );

    setPosts(postsWithUsers);
    setLoading(false);
  };

  const toggleCommentInput = (postId) => {
    setShowCommentInput((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  if (loading) {
    return (
      <p className="flex justify-center items-center w-full">
        <LoaderCircle className="animate-spin" />
      </p>
    );
  }

  return (
    <div className="space-y-4 mb-2">
      {posts.map((post) => (
        <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
          <Link href={`/profile?userId=${post.user_id}`}>
            <div className="flex items-center space-x-3">
              <img
                src={post.user.avatar_url || "/default-avatar.png"}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-semibold">{post.user.username}</span>
              <span className="text-gray-500 text-sm">
                {new Date(post.created_at).toLocaleString()}
              </span>
            </div>
          </Link>

          <p className="mt-2 text-gray-700">{post.title}</p>

          {post.image_url && (
            <div className="mt-4">
              <img
                src={post.image_url}
                alt="Post Image"
                className="w-full h-[400px] sm:h-[500px] object-cover rounded-lg shadow-md"
              />
            </div>
          )}

          
          <div className="flex space-x-6 mt-4">
            <button
              onClick={() => toggleCommentInput(post.id)}
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-500"
            >
              <Send size={18} />
              <span>Comment</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-red-500">
              <Heart size={18} />
              <span>Like</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500">
              <Share size={18} />
              <span>Share</span>
            </button>
          </div>

         
          {showCommentInput[post.id] && (
            <div className="mt-4">
              <div className="mt-4 flex items-center space-x-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                  Post
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default PostFeed;
