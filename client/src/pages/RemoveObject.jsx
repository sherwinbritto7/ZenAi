import React, { useState } from "react";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Sparkles,
  Scissors,
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

const ObjectRemoval = () => {
  const pageTheme = AiToolsData.find(
    (tool) => tool.path === "/ai/remove-object",
  );
  const themeColor = pageTheme?.bg?.from || "#2563EB";
  const secondaryColor = pageTheme?.bg?.to || "#3B82F6";

  const [image, setImage] = useState(null); // Local preview
  const [file, setFile] = useState(null); // Raw file for backend
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState("");

  const { getToken } = useAuth();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImage(URL.createObjectURL(selectedFile));
      setResultImage(""); // Clear previous results
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setFile(null);
    setResultImage("");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!file || !description)
      return toast.error("Please provide image and description");

    try {
      setLoading(true);

      if (description.split(" ").length > 1) {
        return toast("Please enter only one object name.");
      }

      const formData = new FormData();
      formData.append("image", file);
      formData.append("prompt", description); // Backend usually expects 'prompt' for generative fill

      const { data } = await axios.post("/api/ai/remove-object", formData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        setResultImage(data.resultImage);
        toast.success("Object removed successfully!");

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
    /* RESPONSIVE WRAPPER: Scrollable on mobile, fixed on desktop */
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-stretch gap-6 lg:h-[calc(100vh-140px)] pb-10 font-outfit lg:overflow-hidden overflow-y-auto">
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
            Object Removal
          </h1>
        </div>

        <div className="flex-1 space-y-6 lg:overflow-y-auto pr-1">
          {/* File Upload Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Upload Image
              </p>
              {image && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={10} /> Reset
                </button>
              )}
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
                className={`border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center text-center ${
                  image
                    ? "border-blue-100 bg-blue-50/10"
                    : "border-gray-100 bg-gray-50 group-hover:bg-white group-hover:border-blue-200"
                }`}
              >
                {image ? (
                  <div className="relative">
                    <img
                      src={image}
                      alt="preview"
                      className="w-full max-h-40 object-contain rounded-xl bg-white shadow-sm"
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
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <p className="text-xs font-bold text-gray-700">
                      Click to upload image
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Textarea Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                What to remove?
              </label>
              <Info size={14} className="text-gray-300" />
            </div>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="w-full p-4 h-24 outline-none text-sm rounded-xl border border-gray-100 bg-gray-50 focus:bg-white transition-all resize-none leading-relaxed"
              placeholder="e.g. Remove the power lines in the sky..."
              required
            />
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <ShieldCheck className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Secure, encrypted processing. Your original image stays private.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          disabled={loading || !image || !description}
          className="w-full flex justify-center items-center gap-2 text-white px-4 py-4 mt-8 shrink-0 text-sm font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
          style={{
            background: `linear-gradient(to right, ${themeColor}, ${secondaryColor})`,
            boxShadow:
              image && description
                ? `0 10px 20px -5px ${themeColor}60`
                : "none",
          }}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Scissors className="w-4 h-4" /> Remove Object
            </>
          )}
        </button>
      </form>

      {/* 2. RIGHT COLUMN: Result Display */}
      <div className="flex-1 p-6 bg-white rounded-2xl flex flex-col border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="flex items-center justify-between border-b border-gray-50 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <Scissors className="w-5 h-5" style={{ color: themeColor }} />
            <h1 className="text-xl font-bold text-gray-900">Processed Image</h1>
          </div>
          {resultImage && (
            <a
              href={resultImage}
              download="cleaned-image.png"
              className="flex items-center gap-2 text-[10px] font-bold text-white bg-green-500 px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors uppercase"
            >
              <Download size={12} /> Download
            </a>
          )}
        </div>

        <div className="flex-1 flex justify-center items-center overflow-hidden bg-gray-50/30 rounded-xl mt-4 relative">
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-gray-100 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-sm text-gray-400 animate-pulse">
                Removing objects...
              </p>
            </div>
          ) : resultImage ? (
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <img
                src={resultImage}
                alt="Result"
                className="max-w-full max-h-full object-contain drop-shadow-xl rounded-lg"
              />
            </div>
          ) : (
            <div className="text-sm flex flex-col items-center gap-4 text-gray-400 text-center px-8">
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center">
                <Scissors
                  className="w-8 h-8 opacity-20"
                  style={{ color: themeColor }}
                />
              </div>
              <p className="max-w-[240px]">
                Upload an image and describe the object to{" "}
                <span className="font-bold text-gray-600">"Remove"</span> it
                seamlessly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ObjectRemoval;
