import React from "react";
import { AlertCircle, X, Trash2, Loader2 } from "lucide-react";

const DeleteModal = ({ isOpen, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;

  return (
    /* THE FLEXBOX WRAPPER: Centers the child dead-center */
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 1. The Glassmorphism Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={loading ? null : onClose}
      />

      {/* 2. The Modal Card */}
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 ease-out">
        {/* Visual Danger Indicator */}
        <div className="h-1.5 w-full bg-red-100">
          <div
            className={`h-full bg-red-500 transition-all duration-[2000ms] ${loading ? "w-full" : "w-0"}`}
          />
        </div>

        <div className="p-8">
          {/* Branded Icon Section */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-200 rounded-full blur-2xl opacity-40 animate-pulse" />
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-red-50 to-red-100 text-red-500 flex items-center justify-center border border-red-200 shadow-inner">
                <AlertCircle size={40} strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <div className="text-center space-y-3">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              Delete Creation?
            </h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed px-4">
              This will permanently remove this asset from your studio. You
              cannot undo this action.
            </p>
          </div>

          {/* Centered Button Stack */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={onConfirm}
              disabled={loading}
              className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-red-600 active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-3 shadow-xl shadow-gray-200 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 size={20} />
              )}
              {loading ? "Deleting..." : "Yes, Delete It"}
            </button>

            <button
              onClick={onClose}
              disabled={loading}
              className="w-full py-3 text-gray-400 font-bold rounded-xl hover:text-gray-600 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Close Button */}
        {!loading && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-gray-300 hover:text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default DeleteModal;
