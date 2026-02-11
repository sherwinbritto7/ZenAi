import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { SignIn, useUser } from "@clerk/clerk-react";

const Layout = () => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const { user } = useUser();

  return user ? (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* HEADER / NAVBAR */}
      <nav className="w-full px-6 h-14 flex items-center justify-between border-b border-gray-100 bg-white z-[60] shrink-0">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <img
            src={assets.logo}
            className="w-32 sm:w-36 transition-transform group-hover:scale-105"
            alt="Zen.ai Logo"
          />
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          className="p-2 rounded-xl hover:bg-gray-50 lg:hidden transition-all active:scale-90"
          onClick={() => setSidebar(!sidebar)}
        >
          {sidebar ? (
            <X className="w-6 h-6 text-gray-600" />
          ) : (
            <Menu className="w-6 h-6 text-gray-600" />
          )}
        </button>
      </nav>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* SIDEBAR */}
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />

        {/* PAGE CONTENT */}
        <main className="flex-1 bg-[#F8FAFC] overflow-y-auto relative p-4 sm:p-8">
          {/* Subtle background glow for the content area */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-[#3744FB]/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
      <div className="scale-95 sm:scale-100 transition-transform">
        <SignIn />
      </div>
    </div>
  );
};

export default Layout;
