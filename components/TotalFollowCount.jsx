import { getUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";

function TotalFollowCount({ userId }) {
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);

  useEffect(() => {
    const fetchFollowData = async () => {
      let id = userId;

      if (!id) {
        const user = await getUser();
        if (!user) return;
        id = user.id;
      }
     
      const { count: followers, error: followersError } = await supabase
        .from("followers")
        .select("*", { count: "exact", head: true })
        .eq("following_id", id);

      
      const { count: following, error: followingError } = await supabase
        .from("followers")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", id);

      
      const { count: posts, error: postsError } = await supabase
        .from("posts") 
        .select("*", { count: "exact", head: true })
        .eq("user_id", id);

      if (!followersError) setFollowersCount(followers || 0);
      if (!followingError) setFollowingCount(following || 0);
      if (!postsError) setPostsCount(posts || 0);
    };

    fetchFollowData();
  }, [userId]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6 grid grid-cols-3 gap-4">
      <div className="text-center">
        <h3 className="font-semibold text-lg">Followers</h3>
        <p className="text-gray-600">{followersCount}</p>
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-lg">Following</h3>
        <p className="text-gray-600">{followingCount}</p>
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-lg">Posts</h3>
        <p className="text-gray-600">{postsCount}</p>
      </div>
    </div>
  );
}

export default TotalFollowCount;
