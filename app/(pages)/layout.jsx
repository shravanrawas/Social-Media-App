import Mobilenav from "@/components/Mobilenav";
import Sidebar from "@/components/Sidebar";
import Trending from "@/components/Trending";
import React from "react";

function Pagelayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      <div className="flex-1 overflow-y-scroll h-screen">{children}</div>
      <Mobilenav/>

      <Trending />
    </div>
  );
}

export default Pagelayout;
