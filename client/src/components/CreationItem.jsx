import React, { useState } from "react";
import Markdown from "react-markdown";
import {
  ChevronDown,
  Copy,
  Image as ImageIcon,
  FileText,
  Trash2,
} from "lucide-react";

const CreationItem = ({ item, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.content);
    alert("Copied to clipboard!");
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      className={`p-5 max-w-5xl bg-white border transition-all duration-300 rounded-2xl cursor-pointer ${
        expanded
          ? "border-[#3744FB] shadow-md"
          : "border-gray-100 hover:border-gray-200 shadow-sm"
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400 group-hover:text-[#3744FB] transition-colors">
            {item.type === "image" ? (
              <ImageIcon size={20} />
            ) : (
              <FileText size={20} />
            )}
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-gray-900 truncate leading-tight">
              {item.prompt}
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              {new Date(item.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline-block px-3 py-1 bg-blue-50 text-[#3744FB] text-[10px] font-bold uppercase tracking-wider rounded-full border border-blue-100">
            {item.type}
          </span>
          <ChevronDown
            size={18}
            className={`text-gray-400 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {expanded && (
        <div
          className="mt-5 pt-5 border-t border-gray-100 cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          {/* TOOLBAR */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {item.type === "image" ? "Generated Asset" : "AI Response"}
            </span>

            <div className="flex items-center gap-2">
              {/* DELETE BUTTON */}
              <button
                onClick={handleDeleteClick}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-all text-xs font-bold border border-red-100"
              >
                <Trash2 size={14} />
                Delete
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-[#3744FB]/5 text-gray-500 hover:text-[#3744FB] rounded-lg transition-all text-xs font-bold border border-gray-100"
              >
                <Copy size={14} />
                Copy {item.type === "image" ? "URL" : "Content"}
              </button>
            </div>
          </div>

          {item.type === "image" ? (
            <div className="max-w-md mx-auto sm:mx-0">
              <img
                src={item.content}
                alt="AI Generation"
                className="rounded-xl w-full object-cover shadow-sm border border-gray-100"
              />
            </div>
          ) : (
            <div className="bg-gray-50/50 p-4 rounded-xl text-sm text-slate-700 leading-relaxed max-h-[400px] overflow-y-auto no-scrollbar border border-gray-50">
              <div className="reset-tw prose prose-sm prose-slate max-w-none">
                <Markdown>{item.content}</Markdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItem;
