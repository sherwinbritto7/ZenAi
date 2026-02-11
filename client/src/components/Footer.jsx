import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-10 w-full text-gray-500 mt-20">
      <div className="flex flex-col md:flex-row justify-between gap-10 border-b border-gray-500/30 pb-8">
        {/* Brand */}
        <div className="md:max-w-96">
          <img className="h-10" src={assets.logo} alt="logo" />
          <p className="mt-6 text-sm leading-relaxed">
            Build faster and create smarter with our powerful AI tools. Generate
            content, enhance creativity, and streamline your workflow — all in
            one platform.
          </p>
        </div>

        {/* Links + Newsletter */}
        <div className="flex-1 flex flex-col sm:flex-row items-start md:justify-end gap-16">
          {/* Company Links */}
          <div>
            <h2 className="font-semibold mb-5 text-gray-800">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a href="#" className="hover:text-gray-800">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-800">
                  AI Tools
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-800">
                  Testimonals
                </a>
              </li>
              <li>
                <a href="#plan" className="hover:text-gray-800">
                  Plans
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <p className="pt-5 text-center text-xs md:text-sm pb-6">
        © {new Date().getFullYear()}{" "}
        <a href="https://sherwinb.vercel.app/" target="_blank">
          Sherwin Britto
        </a>
        . All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
