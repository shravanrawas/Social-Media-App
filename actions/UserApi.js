import { getUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const getUserData = async (userId) => {
  try {
    let id;
    if (userId) {
      id = userId;
    } else {
      const user = await getUser();
      if (!user || !user.id) {
        console.error("No authenticated user found");
        return null;
      }
      id = user.id;
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};

export const followUser = async (followingId) => {
  const user = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("followers")
    .insert([{ follower_id: user.data.user.id, following_id: followingId }]);

  if (error) throw error;
  return data;
};

export const unfollowUser = async (followingId) => {
  const user = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("followers")
    .delete()
    .match({ follower_id: user.data.user.id, following_id: followingId });

  if (error) throw error;
};

