"use client";

import { useEffect, useState } from "react";
import { Send, Heart, Share, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getUser } from "@/lib/auth";

function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState({}); // Track comments per post
  const [newComment, setNewComment] = useState({}); // Track comment input per post
  const [likes, setLikes] = useState({}); // Track likes per post

  useEffect(() => {
    fetchPosts();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const userData = await getUser();
    if (userData) {
      setUser(userData);
    }
  };

  const fetchPosts = async () => {
    const { data: postsData, error } = await supabase
      .from("posts")
      .select("id, user_id, title, image_url, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
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
          return { ...post, user: { username: "Unknown", avatar_url: "" } };
        }

        return { ...post, user: userData };
      })
    );

    setPosts(postsWithUsers);
    fetchCommentsAndLikes(postsWithUsers);
    setLoading(false);
  };

  const fetchCommentsAndLikes = async (postsData) => {
    const postIds = postsData.map((post) => post.id);

    // Fetch comments for all posts
    const { data: commentData, error: commentError } = await supabase
      .from("comments")
      .select("*")
      .in("post_id", postIds);

    if (commentError) {
      console.error("Error fetching comments:", commentError);
    }

    const commentsMap = {};
    commentData?.forEach((comment) => {
      if (!commentsMap[comment.post_id]) {
        commentsMap[comment.post_id] = [];
      }
      commentsMap[comment.post_id].push(comment);
    });
    setComments(commentsMap);

    // Fetch likes for all posts
    const { data: likeData, error: likeError } = await supabase
      .from("likes")
      .select("post_id, user_id");

    if (likeError) {
      console.error("Error fetching likes:", likeError);
    }

    const likesMap = {};
    likeData?.forEach((like) => {
      if (!likesMap[like.post_id]) {
        likesMap[like.post_id] = [];
      }
      likesMap[like.post_id].push(like.user_id);
    });
    setLikes(likesMap);
  };

  const handleAddComment = async (postId) => {
    const commentText = newComment[postId]?.trim();
    if (!commentText || !user) return;

    const { data, error } = await supabase
      .from("comments")
      .insert([{ post_id: postId, user_id: user.id, content: commentText }]);

    if (error) {
      console.error("Error adding comment:", error);
      return;
    }

    setComments((prevComments) => ({
      ...prevComments,
      [postId]: [...(prevComments[postId] || []), data[0]],
    }));
    setNewComment((prevNewComment) => ({
      ...prevNewComment,
      [postId]: "",
    }));
  };

  const handleToggleLike = async (postId) => {
    if (!user) return;

    const userLiked = likes[postId]?.includes(user.id);

    if (userLiked) {
      await supabase
        .from("likes")
        .delete()
        .match({ post_id: postId, user_id: user.id });

      setLikes((prevLikes) => ({
        ...prevLikes,
        [postId]: prevLikes[postId].filter((id) => id !== user.id),
      }));
    } else {
      await supabase
        .from("likes")
        .insert([{ post_id: postId, user_id: user.id }]);

      setLikes((prevLikes) => ({
        ...prevLikes,
        [postId]: [...(prevLikes[postId] || []), user.id],
      }));
    }
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
              onClick={() => handleToggleLike(post.id)}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-500"
            >
              <Heart
                size={18}
                className={
                  likes[post.id]?.includes(user?.id)
                    ? "text-red-500"
                    : "text-gray-400"
                }
              />
              <span>{likes[post.id]?.length || 0} Likes</span>
            </button>
            <button
              onClick={() =>
                setNewComment((prev) => ({
                  ...prev,
                  [post.id]: prev[post.id] ? "" : " ",
                }))
              }
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-500"
            >
              <Send size={18} />
              <span>Comment</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500">
              <Share size={18} />
              <span>Share</span>
            </button>
          </div>

          {newComment[post.id] !== undefined && (
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newComment[post.id] || ""}
                  onChange={(e) =>
                    setNewComment({
                      ...newComment,
                      [post.id]: e.target.value,
                    })
                  }
                  placeholder="Write a comment..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Post
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {comments[post.id]?.map((comment) => (
                  <div key={comment.id} className="text-sm text-gray-700">
                    <strong>{comment.user_id}: </strong> {comment.content}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default PostFeed;
