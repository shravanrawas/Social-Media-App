"use client";

import { Plus, LoaderCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { getUserData } from "@/actions/UserApi";
import { toast } from "sonner";
import PostFeed from "@/components/PostFeed";

function Homepage() {
 
  const [selectedStory, setSelectedStory] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddStoryDialogOpen, setIsAddStoryDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [stories, setStories] = useState([]);
  const [currentUsername, setCurrentUsername] = useState('');
  const [loading, setLoading] = useState();

  

  useEffect(() => {
    const fetchUser = async () => {
      const Authuser = await getUserData();
      setCurrentUsername(Authuser.username)
    }
    fetchUser();
  })
  
  const handleStoryClick = (story) => {
    setSelectedStory(story);
    setIsDialogOpen(true);

    setTimeout(() => {
      setIsDialogOpen(false);
    }, 10000);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadStory = async () => {
    setLoading(true);
    if (!selectedFile) {
      alert("Please select a file first.");
      setLoading(false);
      return;
    }
  
    const user = await getUser(); 
    if (!user) {
      alert("User not authenticated");
      return;
    }
  
    const fileName = `${user.id}-${Date.now()}`;
    const { data, error } = await supabase.storage
      .from("stories")
      .upload(fileName, selectedFile);
  
    if (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload story.");
      return;
    }
  
    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/stories/${fileName}`;
  
    const { error: insertError } = await supabase
      .from("stories")
      .insert([{ user_id: user.id, image_url: imageUrl, username: currentUsername }]);
  
    if (insertError) {
      console.error("Error inserting story:", insertError);
      alert("Failed to save story.");
      return;
    }
     

    setLoading(false);
    setIsAddStoryDialogOpen(false);
    toast.success("Story uploaded successfully! You won't see it, but your followers can.");
    setSelectedFile(null);
    setPreview("");
  };
  
  const fetchStories = async () => {
    const user = await getUser();
    if (!user) return;
    
    const { data: followingList, error } = await supabase
      .from("followers")
      .select("following_id")
      .eq("follower_id", user.id);
  
    if (error) {
      console.error("Error fetching followers:", error);
      return;
    }
  
    const followingIds = followingList.map((f) => f.following_id);
  
   
    const { data: storiesData, error: storiesError } = await supabase
      .from("stories")
      .select("*")
      .in("user_id", followingIds)
      .order("created_at", { ascending: false });
  
    if (storiesError) {
      console.error("Error fetching stories:", storiesError);
      return;
    }
  
    setStories(storiesData);
    console.log('data', storiesData)
  };
  
  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <div className="container mx-auto p-4 mb-10">
        <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Stories</h2>
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide p-2">
       
          <Dialog open={isAddStoryDialogOpen} onOpenChange={setIsAddStoryDialogOpen}>
            <DialogTrigger asChild>
              <div className="flex flex-col items-center space-y-1 cursor-pointer">
                <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center bg-gray-200">
                  <Plus size={24} className="text-gray-600" />
                </div>
                <span className="text-xs text-gray-700">Add Story</span>
              </div>
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add a Story</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4">
                <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 w-full rounded-lg" />
                {preview && (
                  <img src={preview} alt="Story Preview" className="w-40 h-40 object-cover rounded-lg" />
                )}
                <button onClick={handleUploadStory} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                 {loading ? <LoaderCircle className="animate-spin"/> : 'Upload Story'}
                </button>
              </div>
            </DialogContent>
          </Dialog>

        
          {stories.map((story) => (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} key={story.id}>
              <DialogTrigger asChild>
                <div
                  className="flex flex-col items-center space-y-1 cursor-pointer"
                  onClick={() => handleStoryClick(story)}
                >
                  <div className="w-16 h-16 rounded-full border-2 border-blue-500 p-1">
                    <img
                     src={story?.image_url}
                   
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span className="text-xs text-gray-700">{story?.username.slice(0, 7)}...</span>
                </div>
              </DialogTrigger>

              <DialogContent className="w-full max-w-3xl h-auto">
                <DialogHeader>
                  <DialogTitle>{selectedStory?.username}'s Story</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center">
                  <img
                    src={selectedStory?.image_url}
                    className="w-full h-[500px] sm:h-[600px] object-cover rounded-lg"
                  />
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
        </div>

     <PostFeed/>
    </div>
  );
}

export default Homepage;
