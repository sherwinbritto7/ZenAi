import React from "react";
import { PricingTable } from "@clerk/clerk-react";

const Plan = () => {
  return (
    <div id="plan" className="max-w-2xl mx-auto z-20 my-30">
      <div className="text-center">
        <h2 className="text-gray-900 text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Choose Your Plan
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto text-lg leading-relaxed">
          Flexible pricing that grows with you. Start free and upgrade anytime
          as your content needs expand.
        </p>
      </div>

      <div className="mt-14 max-sm:mx-8">
        <PricingTable />
      </div>
    </div>
  );
};

export default Plan;
