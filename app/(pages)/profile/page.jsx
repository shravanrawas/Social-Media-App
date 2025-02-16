'use client'

import React, { Suspense, useEffect, useState } from "react";
import { getUserData, followUser, unfollowUser } from "@/actions/UserApi";
import { useFetch } from "@/hooks/useFetch";
import { getUser, signOut } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Userposts = React.lazy(() => import("@/components/Userposts"));
const TotalFollowCount = React.lazy(() => import("@/components/TotalFollowCount"));

function SkeletonLoader() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6 animate-pulse">
      <div className="flex justify-center mb-4">
        <div className="w-32 h-32 rounded-full bg-gray-300"></div>
      </div>
      <div className="text-center">
        <div className="h-6 bg-gray-300 w-40 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-300 w-28 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-300 w-48 mx-auto"></div>
      </div>
      <div className="flex gap-2 justify-center mt-4">
        <div className="w-24 h-10 bg-gray-300 rounded-full"></div>
        <div className="w-24 h-10 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
}

function ProfilePage() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const router = useRouter();
  const { data: UserData, fn, loading } = useFetch(getUserData);

  useEffect(() => {
    fn(userId);
  }, [userId]);

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
      if (!user) {
        router.push("/login");
      } else {
        setAuthenticatedUser(user);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!authenticatedUser) return;
      const { data, error } = await supabase
        .from("followers")
        .select("*")
        .match({ follower_id: authenticatedUser.id, following_id: userId });
      if (!error) {
        setIsFollowing(data.length > 0);
      }
    };
    checkFollowStatus();
  }, [userId, authenticatedUser]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(userId);
        setIsFollowing(false);
      } else {
        await followUser(userId);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  const isCurrentUser = authenticatedUser && UserData && authenticatedUser.id === UserData.id;

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <SkeletonLoader />
      ) : UserData ? (
        <>
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex justify-center mb-4">
              <Dialog>
                <DialogTrigger asChild>
                  <img
                    src={UserData.avatar_url || "https://via.placeholder.com/150"}
                    alt="User Avatar"
                    className="w-32 h-32 object-cover rounded-full border-4 border-blue-500 cursor-pointer"
                  />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{UserData.username || "Unknown User"}</DialogTitle>
                  </DialogHeader>
                  <img
                    src={UserData.avatar_url || "https://via.placeholder.com/150"}
                    alt="User Avatar Large"
                    className="w-full h-[500px] sm:h-[600px] object-cover rounded-lg"
                  />
                </DialogContent>
              </Dialog>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-semibold">{UserData.username || "Unknown User"}</h2>
              <p className="text-gray-500 mt-2">{UserData.title || "No title set"}</p>
              <p className="text-gray-700 mt-2">{UserData.bio || "No bio available"}</p>
            </div>
            <div className="flex gap-2 justify-center mt-4">
              {isCurrentUser ? (
                <>
                  <Link href="/editprofile">
                    <button className="px-6 py-2 rounded-full text-white font-semibold bg-blue-500">
                      Edit Profile
                    </button>
                  </Link>
                  <button onClick={handleSignOut} className="px-6 py-2 rounded-full text-white font-semibold bg-red-500">
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={handleFollowToggle}
                  className={`px-6 py-2 rounded-full text-white font-semibold transition ${isFollowing ? "bg-gray-400" : "bg-blue-500"}`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>

          <Suspense fallback={<SkeletonLoader />}>
            <TotalFollowCount userId={userId} />
          </Suspense>

          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="flex justify-center gap-4">
              <TabsTrigger value="posts">Posts</TabsTrigger>
            </TabsList>

            <TabsContent value="posts">
              <Suspense fallback={<p>Loading posts...</p>}>
                <Userposts userId={userId} />
              </Suspense>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
}

export default ProfilePage;
