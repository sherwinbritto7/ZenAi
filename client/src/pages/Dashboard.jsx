import React, { useEffect, useState } from "react";
import { Gem, Sparkles, Clock, Loader2 } from "lucide-react";
import { Protect, useAuth } from "@clerk/clerk-react";
import CreationItem from "../components/CreationItem";
import DeleteModal from "../components/DeleteModal"; // NEW
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { getToken } = useAuth();

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/user/get-user-creations", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    setIsDeleting(true);
    const id = selectedId;
    const previousCreations = [...creations];

    setCreations((prev) => prev.filter((item) => (item.id || item._id) !== id));
    setShowDeleteModal(false);

    try {
      const token = await getToken();
      const { data } = await axios.delete(`/api/user/delete-creation/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success("Creation removed");
      } else {
        setCreations(previousCreations);
        toast.error(data.message);
      }
    } catch (error) {
      setCreations(previousCreations);
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false);
      setSelectedId(null);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* CUSTOM DELETE PROMPT */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-gray-500 text-sm">
          Here's an overview of your AI creative studio.
        </p>
      </div>

      <div className="flex justify-start gap-6 flex-wrap">
        {/* Total Creation Card */}
        <div className="group flex justify-between items-center w-full sm:w-72 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              Total Creations
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              {loading ? (
                <div className="h-8 w-12 bg-gray-200 animate-pulse rounded" />
              ) : (
                creations.length
              )}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#3744FB]/10 text-[#3744FB] flex justify-center items-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Active Plan Card */}
        <div className="group flex justify-between items-center w-full sm:w-72 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              Active Plan
            </p>
            <h2 className="text-2xl font-extrabold text-gray-900">
              <Protect plan="premium" fallback="Free">
                Premium
              </Protect>
            </h2>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center group-hover:rotate-12 transition-transform shadow-lg shadow-purple-200">
            <Gem className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Creations Section */}
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-6">
          <Clock size={18} className="text-[#3744FB]" />
          <h3 className="font-bold text-gray-900">Recent Creations</h3>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full h-24 bg-gray-50 border border-gray-100 rounded-2xl animate-pulse flex items-center p-4 gap-4"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-3">
                  <div className="h-3 bg-gray-200 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {creations.length > 0 ? (
              creations.map((item) => (
                <div
                  key={item.id || item._id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  <CreationItem
                    item={item}
                    onDelete={() => confirmDelete(item.id || item._id)}
                  />
                </div>
              ))
            ) : (
              <div className="py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400">
                  No creations yet. Start building something amazing!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
