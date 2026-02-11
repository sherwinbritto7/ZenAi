import React from "react";
import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import { NavLink } from "react-router-dom";
import {
  Eraser,
  FileText,
  Hash,
  Home,
  Image,
  LogOut,
  Scissors,
  SquarePen,
  Users,
  ChevronRight,
  Settings,
} from "lucide-react";

// Added a "color" property to match your AiToolsData logic
const navItems = [
  { to: "/ai", label: "Dashboard", Icon: Home, color: "#3744FB" },
  {
    to: "/ai/write-article",
    label: "Write Article",
    Icon: SquarePen,
    color: "#3744FB",
  },
  { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash, color: "#8B5CF6" },
  {
    to: "/ai/generate-images",
    label: "Generate Images",
    Icon: Image,
    color: "#06B6D4",
  },
  {
    to: "/ai/remove-background",
    label: "Remove Background",
    Icon: Eraser,
    color: "#F97316",
  },
  {
    to: "/ai/remove-object",
    label: "Remove Object",
    Icon: Scissors,
    color: "#2563EB",
  },
  {
    to: "/ai/review-resume",
    label: "Review Resume",
    Icon: FileText,
    color: "#475569",
  },
  { to: "/ai/community", label: "Community", Icon: Users, color: "#3744FB" },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  if (!user) return null;

  return (
    <>
      {/* 1. BLUR OVERLAY */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-500 lg:hidden ${
          sidebar ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebar(false)}
      />

      {/* 2. SIDEBAR CONTAINER */}
      <div
        className={`w-64 bg-[#FBFDFF] border-r border-gray-100 flex flex-col fixed lg:sticky top-14 h-[calc(100vh-3.5rem)] left-0 z-50 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          sidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* TOP SECTION: Branding & Profile Area */}
        <div className="pt-8 pb-6 px-4 flex flex-col items-center shrink-0">
          <div
            className="relative group cursor-pointer mb-3"
            onClick={openUserProfile}
          >
            {/* Pulsing Aura around avatar */}
            <div className="absolute inset-0 bg-[#3744FB]/20 blur-xl rounded-full animate-pulse group-hover:bg-[#3744FB]/40 transition-all duration-700" />
            <img
              src={user.imageUrl}
              className="w-14 h-14 rounded-[1.25rem] border-2 border-white shadow-xl relative z-10 object-cover transform group-hover:scale-105 transition-transform duration-300"
              alt="avatar"
            />
          </div>
          <h1 className="font-bold text-slate-800 text-sm tracking-tight truncate w-full text-center px-4">
            {user.fullName}
          </h1>
          <div className="mt-1.5 px-3 py-0.5 rounded-full bg-[#3744FB]/5 border border-[#3744FB]/10">
            <div className="text-[9px] uppercase tracking-[0.15em] text-[#3744FB] font-black">
              <Protect plan="premium" fallback={<span>Free Plan</span>}>
                <span>Premium Member</span>
              </Protect>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4 scrollbar-hide">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-3 mb-3">
            Main Menu
          </p>
          {navItems.map(({ to, label, Icon, color }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/ai"}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `group px-4 py-2.5 flex items-center justify-between rounded-xl transition-all duration-300 text-sm font-semibold ${
                  isActive
                    ? "bg-[#3744FB] text-white shadow-lg shadow-[#3744FB]/25 translate-x-1"
                    : "text-slate-500 hover:bg-white hover:shadow-sm hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors duration-300 ${
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-slate-900"
                      }`}
                      // If not active, show a tiny hint of tool color on hover
                      style={{ color: !isActive ? undefined : "white" }}
                    />
                    <span className="tracking-tight">{label}</span>
                  </div>
                  {isActive ? (
                    <ChevronRight size={14} className="text-white/60" />
                  ) : (
                    <div
                      className="w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: color }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* BOTTOM SECTION: User Settings & Logout */}
        <div className="p-4 mt-auto">
          <div className="bg-slate-100/50 rounded-2xl p-2 border border-slate-200/50 flex items-center gap-2">
            <button
              onClick={openUserProfile}
              className="flex items-center gap-2 flex-1 px-2 py-1.5 hover:bg-white rounded-lg transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                <Settings className="w-4 h-4 text-slate-400 group-hover:rotate-90 transition-transform duration-500" />
              </div>
              <span className="text-xs font-bold text-slate-700">Account</span>
            </button>

            <div className="w-[1px] h-6 bg-slate-200" />

            <button
              onClick={signOut}
              className="p-2.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-white transition-all shadow-none hover:shadow-sm"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
