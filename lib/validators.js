import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().min(10, "Username is Required"),
});

export const profileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  bio: z.string().max(200, "Bio cannot exceed 200 characters").optional(),
});