"use client";

import { getUser } from "@/lib/auth";
import { Image, LoaderCircle, Smile } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";


function Createpostpage() {
  const [postImage, setPostImage] = useState(null);
  const [postText, setPostText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(); 
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      if (!userData) router.push("/login");
    };
    fetchUser();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setPostImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handlePostSubmit = async () => {
    setLoading(true);
    if (!postText.trim() && !imageFile) {
      toast.error("Please enter some text or upload an image!");
      setLoading(false);
      return;
    }

    try {
    
      const user = await getUser();
      if (!user) {
        toast.error("User not authenticated.");
        router.push("/login");
        return;
      }

      let imageUrl = null;

      if (imageFile) {
        const fileName = `${user.id}-${Date.now()}.${imageFile.name.split('.').pop()}`;
        const { data, error } = await supabase.storage
          .from("post-images")
          .upload(fileName, imageFile);

        if (error) {
          throw new Error("Error uploading image");
        }
        imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/post-images/${data.path}`;
      }

      
      const { error } = await supabase.from("posts").insert([
        {
          user_id: user.id,
          title: postText,
          image_url: imageUrl,
        },
      ]);

      if (error) {
        throw new Error("Error inserting post");
        setLoading(false);
      }

      toast.success("Post uploaded successfully!");
      setPostText("");
      setPostImage(null);
      setImageFile(null);
      router.push("/home");
      setLoading(false);
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    }
  };

  const handleEmojiClick = (emojiData) => {
    setPostText((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Create Post</h2>

        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full border-2 border-gray-300 rounded-lg p-3 h-24 resize-none"
        />

        <div className="flex justify-between mt-4 relative">
          <div className="flex items-center space-x-4">
            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <Smile size={24} className="text-blue-500" />
            </button>
            {showEmojiPicker && (
              <div className="absolute top-10 left-0 z-10">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
            <label htmlFor="upload-image" className="cursor-pointer">
              <Image size={24} className="text-blue-500" />
              <input
                type="file"
                id="upload-image"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <button
            onClick={handlePostSubmit}
            className="bg-blue-500 text-white px-6 py-2 rounded-full"
          >
           {loading ? <LoaderCircle className="animate-spin"/> : 'Post'}
          </button>
        </div>

        {postImage && (
          <div className="mt-4">
            <img
              src={postImage}
              alt="Uploaded"
              className="w-full h-[300px] object-cover rounded-lg shadow-md"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Createpostpage;
