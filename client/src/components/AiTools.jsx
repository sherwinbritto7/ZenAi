import React from "react";
import { AiToolsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { ChevronRight } from "lucide-react";

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="px-6 sm:px-20 xl:px-32 my-32 relative font-sans">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(circle_at_center,_#3744FB10_0%,_transparent_70%)] -z-10" />

      <div className="text-center mb-16">
        <h2 className="text-gray-900 text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Powerful AI Tools
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
          Unlock your creative potential with our specialized AI suite—built for
          speed, precision, and ease of use.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {AiToolsData.map((tool, index) => (
          <div
            key={index}
            className="group relative p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm 
                       hover:shadow-[0_20px_50px_rgba(55,68,251,0.15)] 
                       hover:-translate-y-3 hover:scale-[1.02]
                       transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
                       cursor-pointer flex flex-col h-full overflow-hidden"
            onClick={() => user && navigate(tool.path)}
          >
            {/* Hover Gradient Background Overlay */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${tool.bg.from}, ${tool.bg.to})`,
              }}
            />

            <div className="flex items-start justify-between mb-8">
              {/* Icon with Ring and Shadow */}
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full group-hover:bg-white/40 transition-all duration-500" />
                <tool.Icon
                  className="relative w-16 h-16 p-4 text-white rounded-2xl shadow-lg transition-transform duration-500 group-hover:rotate-6"
                  style={{
                    background: `linear-gradient(135deg, ${tool.bg.from}, ${tool.bg.to})`,
                    boxShadow: `0 8px 16px -4px ${tool.bg.from}80`,
                  }}
                />
              </div>

              <div className="mt-2 p-2 rounded-full border border-gray-100 group-hover:bg-[#3744FB] group-hover:text-white group-hover:border-[#3744FB] transition-all duration-300">
                <ChevronRight size={20} />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#3744FB] transition-colors duration-300">
              {tool.title}
            </h3>

            <p className="mt-4 text-gray-500 leading-relaxed text-[15px] flex-grow">
              {tool.description}
            </p>

            {/* Bottom Progress Accent */}
            <div className="mt-8 h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
              <div
                className="h-full w-0 group-hover:w-full transition-all duration-700 ease-out rounded-full"
                style={{
                  background: `linear-gradient(to right, ${tool.bg.from}, ${tool.bg.to})`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiTools;
