'use client'

import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";
import { useEffect } from "react";

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
    <div className="h-screen flex flex-col items-center justify-center text-center bg-gray-100 text-gray-900 px-6 relative">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/path/to/your/background-image.jpg')" }} />

      <div className="relative z-10 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-5xl font-bold tracking-wide mb-6 text-blue-600">
          Welcome to <span className="text-green-500">Socialo</span>
        </h1>

        <p className="text-lg text-gray-700 mb-10 max-w-xl leading-relaxed">
          A space to connect, share, and engage with your community. Join now and be part of the future of social networking!
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => router.push("/login")}
            className="text-lg px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-all rounded-lg shadow-lg"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="text-lg px-6 py-3 bg-green-500 text-white hover:bg-green-600 transition-all rounded-lg shadow-lg"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
