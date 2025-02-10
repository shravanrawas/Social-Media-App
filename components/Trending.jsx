import React from "react";

function Trending() {
  return (
    <div className="w-80 hidden md:block bg-white border-l border-gray-200 p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Trending</h2>

      <div className="space-y-3">
        <div className="text-gray-700">
          <p className="font-bold">#ReactJS</p>
          <p className="text-sm text-gray-500">1.2k Posts</p>
        </div>
        <div className="text-gray-700">
          <p className="font-bold">#NextJS</p>
          <p className="text-sm text-gray-500">850 Posts</p>
        </div>
        <div className="text-gray-700">
          <p className="font-bold">#WebDev</p>
          <p className="text-sm text-gray-500">650 Posts</p>
        </div>
      </div>

      <button className="w-full bg-blue-500 text-white py-2 rounded-full">
        See More
      </button>
    </div>
  );
}

export default Trending;
