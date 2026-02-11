import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Heart, User, Sparkles } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      const { data } = await axios.get("/api/user/get-published-creations", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setCreations(data.creations);
      }
    } catch (error) {
      toast.error("Failed to load creations");
    } finally {
      setLoading(false);
    }
  };

  const imageLikeToggle = async (id) => {
    if (!user) return toast.error("Please login to like");
    const originalCreations = [...creations];

    setCreations((prev) =>
      prev.map((item) => {
        if (item.id === id || item._id === id) {
          const isLiked = item.likes.includes(user.id);
          return {
            ...item,
            likes: isLiked
              ? item.likes.filter((uid) => uid !== user.id)
              : [...item.likes, user.id],
          };
        }
        return item;
      }),
    );

    try {
      const { data } = await axios.post(
        "/api/user/toggle-like-creation",
        { id },
        { headers: { Authorization: `Bearer ${await getToken()}` } },
      );
      if (!data.success) {
        setCreations(originalCreations);
        toast.error(data.message);
      }
    } catch (error) {
      setCreations(originalCreations);
      toast.error("Connection error");
    }
  };

  useEffect(() => {
    if (user) fetchCreations();
  }, [user]);

  // --- LOADING ANIMATION (SKELETON GRID) ---
  if (loading) {
    return (
      <div className="flex-1 h-full flex flex-col gap-6 p-4 lg:p-8 animate-pulse">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-64 bg-gray-200 rounded-lg" />
          <div className="h-4 w-80 bg-gray-100 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="aspect-square bg-gray-200" />
              <div className="p-3 flex justify-between items-center">
                <div className="h-3 w-12 bg-gray-100 rounded" />
                <div className="h-3 w-6 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col gap-6 p-4 lg:p-8 font-outfit">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          Community Creations <Sparkles size={20} className="text-primary" />
        </h1>
        <p className="text-sm text-gray-500">
          Explore and be inspired by what others are building with Zen AI.
        </p>
      </div>

      <div className="bg-white/50 backdrop-blur-sm h-full w-full rounded-2xl overflow-y-auto pr-2 custom-scrollbar">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {creations.map((creation, index) => {
            const isLiked = creation.likes.includes(user?.id);
            const creationId = creation.id || creation._id;

            return (
              <div
                key={index}
                className="relative group bg-white border border-gray-100 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={creation.content}
                    alt="AI"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <User size={12} className="text-white" />
                      </div>
                      <span className="text-[10px] font-bold text-white uppercase truncate max-w-[60px]">
                        {creation.userName || "Creator"}
                      </span>
                    </div>

                    <button
                      onClick={() => imageLikeToggle(creationId)}
                      className="flex items-center gap-1 group/like"
                    >
                      <span className="text-xs font-bold text-white">
                        {creation.likes.length}
                      </span>
                      <Heart
                        size={18}
                        className={`transition-all duration-300 transform active:scale-150 ${
                          isLiked ? "fill-red-500 text-red-500" : "text-white"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="p-2 sm:p-3 flex items-center justify-between bg-white group-hover:hidden">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                      Live
                    </span>
                  </div>
                  <button
                    onClick={() => imageLikeToggle(creationId)}
                    className="flex items-center gap-1 text-gray-400"
                  >
                    <span className="text-[10px] font-bold">
                      {creation.likes.length}
                    </span>
                    <Heart
                      size={12}
                      className={isLiked ? "fill-red-500 text-red-500" : ""}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Community;
