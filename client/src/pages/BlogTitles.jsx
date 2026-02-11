import React, { useState } from "react";
import {
  Check,
  Edit,
  FileText,
  Info,
  Sparkles,
  Hash,
  Wand2,
  HashIcon,
} from "lucide-react";
import { AiToolsData } from "../assets/assets";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const pageTheme = AiToolsData.find((tool) => tool.path === "/ai/blog-titles");
  const themeColor = pageTheme?.bg?.from || "#8B5CF6";
  const secondaryColor = pageTheme?.bg?.to || "#D946EF";

  const blogCategories = [
    "General",
    "Technology",
    "Business",
    "Health",
    "Lifestyle",
    "Education",
    "Food",
    "Travel",
  ];

  const [selectedCategory, setSelectedCategory] = useState(blogCategories[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setContent(""); // Clears the UI immediately

      // Updated prompt to ensure multiple titles are generated
      const prompt = `Generate 10 catchy and SEO-friendly blog titles about ${input} for the ${selectedCategory} category. Provide them as a numbered list.`;

      const { data } = await axios.post(
        "/api/ai/generate-blog-title",
        { prompt },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        },
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-stretch gap-6 lg:h-[calc(100vh-140px)] pb-10 font-outfit lg:overflow-hidden overflow-y-auto">
      {/* Inline Style for the Scrollbar */}
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 5px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { 
          background: ${themeColor}40; 
          border-radius: 10px; 
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: ${themeColor}80; }
      `}</style>

      {/* 1. LEFT COLUMN: Configuration Form */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full lg:w-[400px] p-8 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col shrink-0"
      >
        <div className="flex items-center gap-3 mb-8 shrink-0">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${themeColor}1a` }}
          >
            <Sparkles className="w-5 h-5" style={{ color: themeColor }} />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            AI Title Generator
          </h1>
        </div>

        <div className="space-y-6 flex-1 overflow-y-auto pr-1 custom-scroll">
          {/* Keyword Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Keyword
              </label>
              <Info size={14} className="text-gray-300" />
            </div>
            <textarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
              className="w-full p-4 h-24 outline-none text-sm rounded-xl border border-gray-100 bg-gray-50 focus:bg-white transition-all resize-none leading-relaxed"
              onFocus={(e) => (e.target.style.borderColor = themeColor)}
              onBlur={(e) => (e.target.style.borderColor = "#F3F4F6")}
              placeholder="e.g. Remote work trends..."
              required
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Category
            </label>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {blogCategories.map((item, index) => {
                const isSelected = selectedCategory === item;
                return (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setSelectedCategory(item)}
                    className={`group flex items-center justify-between px-3 py-2.5 border rounded-lg text-[11px] font-bold transition-all duration-200 ${
                      isSelected
                        ? "text-white shadow-sm"
                        : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50"
                    }`}
                    style={{
                      backgroundColor: isSelected ? themeColor : "",
                      borderColor: isSelected ? themeColor : "",
                    }}
                  >
                    <span className="truncate mr-1">{item}</span>
                    {isSelected && (
                      <Check
                        size={12}
                        className="shrink-0 text-white"
                        strokeWidth={3}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 text-white px-4 py-4 mt-8 shrink-0 text-sm font-bold rounded-xl transition-all active:scale-[0.98] hover:brightness-110"
          style={{
            background: `linear-gradient(to right, ${themeColor}, ${secondaryColor})`,
            boxShadow: `0 10px 20px -5px ${themeColor}60`,
          }}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <HashIcon className="w-4 h-4" /> Generate Headlines
            </>
          )}
        </button>
      </form>

      {/* Right Column: Blog Titles Preview */}
      <div className="flex-1 p-6 bg-white rounded-2xl flex flex-col border border-gray-100 shadow-sm overflow-hidden">
        {/* Header: shrink-0 ensures the header stays at the top and doesn't get squashed */}
        <div className="flex items-center justify-between border-b border-gray-50 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <Hash className="w-5 h-5" style={{ color: themeColor }} />
            <h1 className="text-xl font-bold text-gray-900">
              Generated Titles
            </h1>
          </div>
          {content && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(content);
                toast.success("Copied!");
              }}
              className="text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase"
            >
              Copy All
            </button>
          )}
        </div>

        {/* Content Area: flex-1 makes this fill all space BELOW the header */}
        <div className="flex-1 overflow-y-auto mt-4 pr-2 custom-scroll scroll-smooth">
          {loading ? (
            <div className="h-full flex flex-col justify-center items-center gap-4 text-center">
              <div
                className="w-10 h-10 border-4 border-gray-100 rounded-full animate-spin"
                style={{ borderTopColor: themeColor }}
              />
              <p className="text-sm text-gray-400">Generating titles...</p>
            </div>
          ) : !content ? (
            <div className="h-full flex flex-col justify-center items-center gap-4 text-gray-400 text-center px-8 opacity-40">
              <Hash className="w-10 h-10" style={{ color: themeColor }} />
              <p>
                Enter keywords and click{" "}
                <span className="font-bold text-gray-600">
                  "Generate Titles"
                </span>{" "}
                to get started
              </p>
            </div>
          ) : (
            /* Adding a bit of padding bottom so the last line isn't cut off by the rounded corner */
            <div className="text-gray-700 leading-relaxed pb-10">
              <div className="reset-tw">
                <Markdown>{content}</Markdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogTitles;
