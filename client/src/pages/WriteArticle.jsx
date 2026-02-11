import React, { useState } from "react";
import { Check, Edit, FileText, Info, Sparkles } from "lucide-react";
import { AiToolsData } from "../assets/assets";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  // 1. Theme Setup from AiToolsData
  const pageTheme = AiToolsData.find(
    (tool) => tool.path === "/ai/write-article",
  );
  const themeColor = pageTheme?.bg?.from || "#3744FB";
  const secondaryColor = pageTheme?.bg?.to || "#4F46E5";

  const articleLength = [
    { length: 800, text: "Short", desc: "500-800 words" },
    { length: 1200, text: "Medium", desc: "800-1200 words" },
    { length: 1600, text: "Long", desc: "1200+ words" },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setContent("");

      const prompt = `Write an article about ${input} in ${selectedLength.desc}`;

      const { data } = await axios.post(
        "/api/ai/generate-article",
        {
          prompt,
          length: selectedLength.length,
        },
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
      {/* LEFT COLUMN: Configuration Form */}
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
            Article Config
          </h1>
        </div>

        <div className="space-y-6 flex-1 overflow-y-auto pr-1">
          {/* Topic Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Article Topic
              </label>
              <Info size={14} className="text-gray-300" />
            </div>
            <textarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
              className="w-full p-4 h-32 outline-none text-sm rounded-xl border border-gray-100 bg-gray-50 focus:bg-white transition-all resize-none leading-relaxed"
              style={{ focusVisible: { borderColor: themeColor } }}
              placeholder="e.g. The impact of blockchain on global finance..."
              required
            />
          </div>

          {/* Compact Length Selection */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Target Length
            </label>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {articleLength.map((item, index) => {
                const isSelected = selectedLength.text === item.text;
                return (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setSelectedLength(item)}
                    className={`group flex flex-col items-center justify-center py-3 border rounded-xl transition-all duration-200 ${
                      isSelected
                        ? "text-white shadow-md"
                        : "bg-white text-gray-400 border-gray-100 hover:bg-gray-50"
                    }`}
                    style={{
                      backgroundColor: isSelected ? themeColor : "",
                      borderColor: isSelected ? themeColor : "",
                    }}
                  >
                    <span
                      className={`text-[11px] font-bold ${isSelected ? "text-white" : "text-gray-700"}`}
                    >
                      {item.text}
                    </span>
                    <span
                      className={`text-[9px] mt-0.5 ${isSelected ? "text-white/70" : "text-gray-400"}`}
                    >
                      {item.desc.split(" ")[0]}
                    </span>
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
              <Edit className="w-4 h-4" /> Generate Article
            </>
          )}
        </button>
      </form>

      {/* RIGHT COLUMN: Article Preview */}
      <div className="flex-1 p-8 bg-white rounded-2xl flex flex-col border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-50 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5" style={{ color: themeColor }} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Preview</h1>
          </div>
          {content && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(content);
                toast.success("Copied to clipboard!");
              }}
              className="text-[10px] font-bold uppercase text-gray-400 hover:text-indigo-600 transition-colors"
            >
              Copy Text
            </button>
          )}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto mt-6 pr-4 scroll-smooth flex justify-center items-center">
          {!content ? (
            <div className="text-sm flex flex-col items-center gap-4 text-gray-400 text-center px-8">
              <Edit
                className="w-10 h-10 opacity-20"
                style={{ color: themeColor }}
              />

              <p className="leading-relaxed">
                Enter a topic and click{" "}
                <span className="font-bold text-gray-600">
                  "Generate Article"
                </span>{" "}
                to see the magic.
              </p>
            </div>
          ) : (
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

export default WriteArticle;
