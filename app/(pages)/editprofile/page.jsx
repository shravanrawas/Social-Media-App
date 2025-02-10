"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUserData } from "@/actions/UserApi";
import { supabase } from "@/lib/supabase";
import { LoaderCircle } from "lucide-react";
import { profileSchema } from "@/lib/validators";

function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUserData();
      if (userData) {
        setUser(userData);
        setValue("name", userData.username || "");
        setValue("title", userData.title || "");
        setValue("bio", userData.bio || "");
        setProfileImage(userData.avatar_url || null);
      }
    };
    fetchData();
  }, [setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let avatar_url = user?.avatar_url || null;

      if (imageFile) {
        const { data: uploadData, error } = await supabase.storage
          .from("avatars")
          .upload(`public/${user.id}`, imageFile, { upsert: true });

        if (error) throw new Error("Image upload failed");

        avatar_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${uploadData.path}`;
      }

      const { error } = await supabase
        .from("users")
        .update({ username: data.name, title: data.title, bio: data.bio, avatar_url })
        .eq("id", user.id);

      if (error) throw new Error("Profile update failed");

      router.push("/profile");
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">Edit Profile</h2>

      <div className="flex flex-col items-center mt-4">
        <label className="cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          <div className="w-24 h-24 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500">Upload</span>
            )}
          </div>
        </label>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="block text-gray-600">Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Enter your name"
            {...register("name")}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-gray-600">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Enter your Title"
            {...register("title")}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-gray-600">Bio</label>
          <textarea
            className="w-full p-2 border rounded-md"
            placeholder="Tell something about yourself..."
            {...register("bio")}
          />
          {errors.bio && <p className="text-red-500 text-sm">{errors.bio.message}</p>}
        </div>

        <div className="flex gap-3 justify-end mt-4">
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-black rounded-md"
          >
            Cancel
          </button>

          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
            {loading ? <LoaderCircle className="animate-spin" /> : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfilePage;
