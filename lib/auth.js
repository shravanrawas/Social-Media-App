import { supabase } from "./supabase";

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signUp = async (email, password, username) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username }, 
    },
  });

  if (error) throw error;

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    console.error("Error fetching user:", userError?.message);
    return null;
  }

  const userId = userData.user.id; 
  
  const { error: insertError } = await supabase.from("users").insert([
    {
      id: userId,
      email,
      username: username,
    },
  ]);

  if (insertError) {
    console.error("Error inserting user into users table:", insertError.message);
    return null;
  }

  console.log("User successfully inserted into users table!");

  return data;
};

export const getUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

export const signOut = async () => {
  await supabase.auth.signOut();
};
