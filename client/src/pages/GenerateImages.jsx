import React, { useState } from "react";
import {
  Check,
  Image as ImageIcon,
  Info,
  Layout,
  Palette,
  Image as ImageBtn,
  Sparkles,
} from "lucide-react";
import { AiToolsData } from "../assets/assets";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  // 1. Theme Setup
  const pageTheme = AiToolsData.find(
    (tool) => tool.path === "/ai/generate-images",
  );
  const themeColor = pageTheme?.bg?.from || "#06B6D4";
  const secondaryColor = pageTheme?.bg?.to || "#3B82F6";

  const imageStyles = [
    "Realistic",
    "Ghibli Style",
    "Anime Style",
    "Cartoon Style",
    "Fantasy Style",
    "Realistic Style",
    "3D Style",
    "Portrait Style",
  ];

  const [selectedStyle, setSelectedStyle] = useState(imageStyles[0]);
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setContent("");
    try {
      setLoading(true);

      const prompt = `Generate an image of ${input} in the style ${selectedStyle}`;

      const { data } = await axios.post(
        "/api/ai/generate-image",
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
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-stretch gap-6 min-h-[600px] pb-10 font-outfit">
      {/* 1. LEFT COLUMN: Configuration Form */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full lg:w-[400px] p-8 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col"
      >
        <div className="flex items-center gap-3 mb-8">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${themeColor}1a` }}
          >
            <Sparkles className="w-5 h-5" style={{ color: themeColor }} />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            AI Image Generator
          </h1>
        </div>

        <div className="space-y-8 flex-1">
          {/* Prompt Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Describe Your Image
              </label>
              <Info size={14} className="text-gray-300" />
            </div>
            <textarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
              className="w-full p-4 h-28 outline-none text-sm rounded-xl border border-gray-100 bg-gray-50 focus:bg-white transition-all resize-none leading-relaxed"
              onFocus={(e) => (e.target.style.borderColor = themeColor)}
              onBlur={(e) => (e.target.style.borderColor = "#F3F4F6")}
              placeholder="e.g. A peaceful Ghibli-style cottage in a flower field..."
              required
            />
          </div>

          {/* Style Selector */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 mb-3">
              <Palette size={12} /> Style
            </label>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {imageStyles.map((style) => {
                const isSelected = selectedStyle === style;
                return (
                  <button
                    type="button"
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`group flex items-center justify-between px-3 py-2.5 border rounded-lg text-[11px] font-bold transition-all duration-200 ${
                      isSelected
                        ? "text-white shadow-sm translate-x-1"
                        : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50"
                    }`}
                    style={{
                      backgroundColor: isSelected ? themeColor : "",
                      borderColor: isSelected ? themeColor : "",
                    }}
                  >
                    <span className="truncate">{style}</span>
                    {isSelected && (
                      <Check
                        size={12}
                        className="text-white shrink-0"
                        strokeWidth={3}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Public Toggle */}
            <div className="flex items-center gap-3 py-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  onChange={(e) => setPublish(e.target.checked)}
                  checked={publish}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-green-500"></div>
              </label>
              <p className="text-xs font-semibold text-gray-600">
                Make this image public
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 text-white px-4 py-4 mt-8 text-sm font-bold rounded-xl transition-all active:scale-[0.98] hover:brightness-110"
          style={{
            background: `linear-gradient(to right, ${themeColor}, ${secondaryColor})`,
            boxShadow: `0 10px 20px -5px ${themeColor}60`,
          }}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <ImageBtn className="w-4 h-4" /> Generate Image
            </>
          )}
        </button>
      </form>

      {/* 2. RIGHT COLUMN: Simple Preview */}
      <div className="flex-1 p-6 bg-white rounded-2xl flex flex-col border border-gray-100 shadow-sm overflow-hidden">
        {/* Header: shrink-0 ensures the title stays visible at the top */}
        <div className="flex items-center gap-3 border-b border-gray-50 pb-4 shrink-0">
          <ImageIcon className="w-5 h-5" style={{ color: themeColor }} />
          <h1 className="text-xl font-bold text-gray-900">Generated Image</h1>
        </div>

        {/* Image Display Area: flex-1 makes it fill the remaining height */}
        <div className="flex-1 flex justify-center items-center overflow-hidden">
          {!content ? (
            /* Your original "Get Started" info */
            <div className="text-sm flex flex-col items-center gap-4 text-gray-400 text-center px-8">
              <ImageIcon
                className="w-10 h-10 opacity-20"
                style={{ color: themeColor }}
              />
              <p>
                Enter a prompt and click{" "}
                <span className="font-bold text-gray-600">
                  "Generate Image"
                </span>{" "}
                to get started
              </p>
            </div>
          ) : (
            /* The actual generated image container */
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {loading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-gray-100 border-t-indigo-500 rounded-full animate-spin" />
                  <p className="text-sm text-gray-400">
                    Creating your masterpiece...
                  </p>
                </div>
              ) : (
                <img
                  src={content}
                  alt="Generated AI"
                  className="max-w-full max-h-full object-contain rounded-xl shadow-lg transition-all"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateImages;
