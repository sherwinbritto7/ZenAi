import React, { useState } from "react";
import {
  FileText,
  Upload,
  Sparkles,
  ShieldCheck,
  Search,
  CheckCircle2,
  Download,
} from "lucide-react";
import { AiToolsData } from "../assets/assets";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const pageTheme = AiToolsData.find(
    (tool) => tool.path === "/ai/review-resume",
  );
  const themeColor = pageTheme?.bg?.from || "#7C3AED";
  const secondaryColor = pageTheme?.bg?.to || "#A78BFA";

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(""); // Stores AI Analysis

  const { getToken } = useAuth();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setReport(""); // Clear previous report
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please upload a resume");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", file);

      const { data } = await axios.post("/api/ai/review-resume", formData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        setReport(data.analysis);
        toast.success("Analysis Complete!");

        // Mobile UX: Scroll to result
        if (window.innerWidth < 1024) {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-stretch gap-6 lg:h-[calc(100vh-140px)] pb-10 font-outfit lg:overflow-hidden overflow-y-auto">
      {/* 1. LEFT COLUMN: Upload Form */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full lg:w-[400px] p-8 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col shrink-0"
      >
        <div className="flex items-center gap-3 mb-8">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${themeColor}1a` }}
          >
            <Sparkles className="w-5 h-5" style={{ color: themeColor }} />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Resume Reviewer
          </h1>
        </div>

        <div className="flex-1 space-y-6 lg:overflow-y-auto pr-1">
          <div className="relative group">
            {!file && (
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                required
              />
            )}

            <div
              className={`border-2 border-dashed rounded-2xl p-10 transition-all flex flex-col items-center justify-center text-center ${file ? "border-purple-100 bg-purple-50/10" : "border-gray-100 bg-gray-50 group-hover:bg-white group-hover:border-purple-200"}`}
            >
              {file ? (
                <div className="flex flex-col items-center">
                  <FileText
                    className="w-10 h-10 mb-3"
                    style={{ color: themeColor }}
                  />
                  <p className="text-sm font-bold text-gray-700 max-w-[200px] truncate">
                    {file.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="mt-2 text-[10px] font-bold text-red-500 uppercase"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-gray-400 mb-2" />
                  <p className="text-sm font-bold text-gray-700">
                    Click to upload document
                  </p>
                  <p className="text-xs text-gray-400">PDF or DOCX</p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <ShieldCheck className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Encryption active. Your data is deleted after the analysis is
              generated.
            </p>
          </div>
        </div>

        <button
          disabled={loading || !file}
          className="w-full flex justify-center items-center gap-2 text-white px-4 py-4 mt-8 text-sm font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
          style={{
            background: `linear-gradient(to right, ${themeColor}, ${secondaryColor})`,
          }}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Search className="w-4 h-4" /> Analyze Resume
            </>
          )}
        </button>
      </form>

      {/* 2. RIGHT COLUMN: Analysis Display */}
      <div className="flex-1 p-6 bg-white rounded-2xl flex flex-col border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="flex items-center justify-between border-b border-gray-50 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" style={{ color: themeColor }} />
            <h1 className="text-xl font-bold text-gray-900">Analysis Report</h1>
          </div>
          {report && (
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 text-[10px] font-bold text-gray-500 hover:text-gray-800 uppercase"
            >
              <Download size={12} /> Save PDF
            </button>
          )}
        </div>

        <div className="flex-1 lg:overflow-y-auto mt-4 pr-2 custom-scroll scroll-smooth">
          {loading ? (
            <div className="h-full flex flex-col justify-center items-center gap-4 text-center">
              <div
                className="w-10 h-10 border-4 border-gray-100 rounded-full animate-spin"
                style={{ borderTopColor: themeColor }}
              />
              <p className="text-sm text-gray-400">
                AI is reading your resume...
              </p>
            </div>
          ) : report ? (
            <div className="text-gray-700 leading-relaxed pb-10">
              <div className="reset-tw">
                <Markdown>{report}</Markdown>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center gap-4 text-gray-400 text-center px-8 opacity-40">
              <Search className="w-12 h-12" />
              <p>
                Upload your resume to see a detailed <br />
                <span className="font-bold">ATS Analysis & Improvements</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewResume;
