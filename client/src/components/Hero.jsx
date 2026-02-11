import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 sm:px-20 xl:px-32 relative flex flex-col w-full justify-center bg-[url(/gradientBackground.png)] bg-cover bg-fixed bg-bottom bg-no-repeat pt-28 md:pt-36 pb-24 transition-all duration-500 overflow-hidden">
      {/* Subtle top glow to frame the content */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-to-b from-[#3744FB]/5 to-transparent pointer-events-none" />

      <div className="text-center mb-10 relative z-10 animate-in fade-in slide-in-from-top-3 duration-1000">
        <h1 className="text-4xl sm:text-5xl md:text-6xl 2xl:text-7xl font-bold mx-auto leading-[1.2] tracking-tight text-gray-900">
          Create amazing content <br className="hidden sm:block" /> with{" "}
          <span className="bg-gradient-to-r from-[#3744FB] via-violet-500 to-fuchsia-500 bg-clip-text text-transparent inline-block hover:brightness-110 transition-all duration-300 cursor-default">
            AI tools
          </span>
        </h1>

        <p className="mt-6 max-w-xs sm:max-w-lg 2xl:max-w-xl mx-auto text-base sm:text-lg text-gray-600 leading-relaxed opacity-90">
          Transform the way you create content with premium AI tools. Generate
          articles, create images, and supercharge your workflow in minutes.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm sm:text-base font-semibold relative z-20">
        {/* Primary CTA with custom shimmer utility */}
        <button
          className="animate-shimmer group relative bg-[#3744FB] text-white px-10 py-4 rounded-full overflow-hidden hover:shadow-[0_20px_40px_rgba(55,68,251,0.3)] hover:-translate-y-1 active:scale-95 transition-all duration-300 cursor-pointer w-full sm:w-auto"
          onClick={() => navigate("/ai")}
        >
          <span className="relative z-10">Start Creating Now</span>
        </button>
      </div>

      {/* Trust Badge - Clean & Integrated */}
      <div className="flex items-center gap-4 mt-16 px-6 py-3 rounded-2xl bg-white/40 backdrop-blur-md border border-white/30 shadow-xl animate-bounce-slow hover:animate-none transition-all cursor-default group mx-auto w-fit relative z-10">
        <img
          src={assets.user_group}
          alt="user group"
          className="h-8 group-hover:scale-110 transition-transform duration-300"
        />
        <div className="flex flex-col items-start leading-tight">
          <span className="text-xs sm:text-sm font-medium text-gray-800">
            Trusted by over{" "}
            <span className="text-[#3744FB] font-bold">10k+</span> creators
          </span>
          <span className="text-[10px] text-gray-500 uppercase tracking-[0.15em] font-bold">
            Worldwide
          </span>
        </div>
      </div>

      {/* Refined Merge Effect: Increased height slightly for a softer blend */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F8FAFC] to-transparent pointer-events-none" />
    </div>
  );
};

export default Hero;
