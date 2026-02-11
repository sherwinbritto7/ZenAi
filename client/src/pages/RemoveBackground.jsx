import React, { useState } from "react";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Sparkles,
  Eraser,
  ShieldCheck,
  X,
  Info,
  Download,
} from "lucide-react";
import { AiToolsData } from "../assets/assets";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  const pageTheme = AiToolsData.find(
    (tool) => tool.path === "/ai/remove-background",
  );
  const themeColor = pageTheme?.bg?.from || "#F97316";
  const secondaryColor = pageTheme?.bg?.to || "#FB923C";

  const [image, setImage] = useState(null); // Local preview of uploaded file
  const [file, setFile] = useState(null); // The actual file object
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState(""); // URL of processed image

  const { getToken } = useAuth();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImage(URL.createObjectURL(selectedFile));
      setResultImage(""); // Clear previous result when new image is uploaded
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setFile(null);
    setResultImage("");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please upload an image first");

    try {
      setLoading(true);
      setResultImage(""); // Clear current result

      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.post(
        "/api/ai/remove-image-background",
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (data.success) {
        setResultImage(data.resultImage);
        toast.success("Background removed successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
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
        <div className="flex items-center gap-3 mb-8 shrink-0">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${themeColor}1a` }}
          >
            <Sparkles className="w-5 h-5" style={{ color: themeColor }} />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            BG Remover
          </h1>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto pr-1">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Upload Image
              </label>
              {image && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={10} /> Remove
                </button>
              )}
            </div>
          </div>

          <div className="relative group">
            {!image && (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                required
              />
            )}

            <div
              className={`border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center text-center ${
                image
                  ? "border-green-100 bg-green-50/30"
                  : "border-gray-100 bg-gray-50 group-hover:bg-white group-hover:border-orange-200"
              }`}
            >
              {image ? (
                <div className="relative">
                  <img
                    src={image}
                    alt="preview"
                    className="w-40 h-40 object-contain rounded-xl shadow-md bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-transform active:scale-90"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-full bg-white shadow-sm mb-4">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-bold text-gray-700">
                    Click to upload
                  </p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <ShieldCheck className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Your images are processed securely and never stored on our
              servers.
            </p>
          </div>
        </div>

        <button
          disabled={loading || !image}
          className="w-full flex justify-center items-center gap-2 text-white px-4 py-4 mt-8 shrink-0 text-sm font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
          style={{
            background: `linear-gradient(to right, ${themeColor}, ${secondaryColor})`,
            boxShadow: image ? `0 10px 20px -5px ${themeColor}60` : "none",
          }}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Eraser className="w-4 h-4" /> Remove Background
            </>
          )}
        </button>
      </form>

      {/* 2. RIGHT COLUMN: Processed Preview */}
      {/* 2. RIGHT COLUMN: Processed Preview */}
      <div className="flex-1 p-6 bg-white rounded-2xl flex flex-col border border-gray-100 shadow-sm overflow-hidden">
        {/* Header: Fixed at top */}
        <div className="flex items-center justify-between border-b border-gray-50 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${themeColor}1a` }}
            >
              <Eraser className="w-5 h-5" style={{ color: themeColor }} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Processed Image</h1>
          </div>

          {/* Download Button: Only shows when result exists */}
          {resultImage && (
            <a
              href={resultImage}
              download="removed-background.png"
              className="flex items-center gap-2 text-[10px] font-bold text-white bg-green-500 px-3 py-1.5 rounded-lg hover:bg-green-600 transition-all uppercase shadow-sm active:scale-95"
            >
              <Download size={12} /> Save Image
            </a>
          )}
        </div>

        {/* Main Display Area */}
        <div className="flex-1 flex justify-center items-center overflow-hidden bg-gray-50/50 rounded-xl mt-6 relative">
          {loading ? (
            /* Loading State */
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-12 h-12 border-4 border-gray-100 rounded-full animate-spin"
                style={{ borderTopColor: themeColor }}
              />
              <p className="text-sm text-gray-400 font-medium animate-pulse">
                Removing background...
              </p>
            </div>
          ) : resultImage ? (
            /* Success State: Show Processed Image */
            <div className="relative w-full h-full flex items-center justify-center p-6">
              {/* Checkerboard background helps see the transparency */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url('https://www.transparenttextures.com/patterns/checkerboard.png')`,
                }}
              ></div>

              <img
                src={resultImage}
                alt="Result"
                className="max-w-full max-h-full object-contain drop-shadow-2xl relative z-10"
                onLoad={() => console.log("Image successfully displayed!")}
                onError={(e) =>
                  console.error("Image failed to load. Source:", e.target.src)
                }
              />
            </div>
          ) : (
            /* Initial Empty State */
            <div className="text-sm flex flex-col items-center gap-4 text-gray-400 text-center px-8">
              <Eraser
                className="w-12 h-12 opacity-10 mb-2"
                style={{ color: themeColor }}
              />
              <p className="max-w-[200px] leading-relaxed">
                Upload an image and click <br />
                <span className="font-bold text-gray-600">
                  "Remove Background"
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoveBackground;
