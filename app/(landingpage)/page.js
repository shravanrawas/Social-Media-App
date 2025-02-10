"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getUser } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      if (userData) {
        router.push("/home");
      } 
    };
    fetchUser();
  }, []);

 
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 relative overflow-hidden">
      
      <motion.div
        className="absolute w-96 h-96 bg-blue-400 opacity-30 rounded-full top-10 left-10 blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-80 h-80 bg-indigo-400 opacity-30 rounded-full bottom-10 right-10 blur-3xl"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.h1
        className="text-6xl font-extrabold tracking-wide mb-6 drop-shadow-lg"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to <span className="text-yellow-300">Socialo</span>
      </motion.h1>

      <motion.p
        className="text-xl text-white/90 mb-10 max-w-xl leading-relaxed"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        A space to connect, share, and engage with your community. Join now and be part of the future of social networking!
      </motion.p>

      <motion.div
        className="flex gap-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        <Button
          onClick={() => router.push("/login")}
          variant="outline"
          className="text-lg text-black px-8 py-4 border-white border-2 hover:bg-white hover:text-blue-600 transition-all shadow-lg"
        >
          Login
        </Button>
        <Button
          onClick={() => router.push("/signup")}
          variant="default"
          className="text-lg px-8 py-4 bg-yellow-300 text-gray-900 hover:bg-yellow-400 transition-all shadow-lg"
        >
          Sign Up
        </Button>
      </motion.div>
    </div>
  );
}
