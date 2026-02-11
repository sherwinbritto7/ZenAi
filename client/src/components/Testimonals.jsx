import React from "react";
import { Star, Quote } from "lucide-react";
import { assets } from "../assets/assets";

const Testimonials = () => {
  const dummyTestimonialData = [
    {
      image:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      name: "Marcus Thorne",
      title: "Founder, AlphaStream",
      content:
        "Zen.ai has become our secret weapon. What used to take a team of three writers now happens in minutes, with a level of creativity that's honestly surprising.",
      rating: 5,
    },
    {
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      name: "Elena Rodriguez",
      title: "Digital Artist & Creator",
      content:
        "The image generation tool is terrifyingly good. It understands lighting and composition better than any other AI I've used. It's transformed my creative process.",
      rating: 5,
    },
    {
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
      name: "Sarah Jenkins",
      title: "SEO Strategist, GrowthLabs",
      content:
        "Usually, AI content feels robotic. Zen.ai produces articles that actually rank and read like they were written by an expert. It’s a complete game-changer for SEO.",
      rating: 4,
    },
  ];

  return (
    <div className="px-6 sm:px-20 xl:px-32 py-24 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3744FB]/5 blur-[120px] rounded-full -z-10" />

      <div className="text-center mb-16">
        <h2 className="text-gray-900 text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Trusted by the Best
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto text-lg leading-relaxed">
          See how the next generation of creators and teams are using Zen.ai to
          redefine their digital presence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {dummyTestimonialData.map((testimonial, index) => (
          <div
            key={index}
            className="group relative p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm 
                       hover:shadow-[0_20px_50px_rgba(55,68,251,0.12)] 
                       hover:-translate-y-3 hover:scale-[1.02]
                       transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
                       cursor-pointer flex flex-col justify-between h-full"
          >
            <div>
              <div className="flex items-center gap-1 mb-6">
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <img
                      key={index}
                      src={
                        index < testimonial.rating
                          ? assets.star_icon
                          : assets.star_dull_icon
                      }
                      className="w-4 h-4"
                      alt="star"
                    />
                  ))}
              </div>

              <div className="relative">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-[#3744FB]/10 rotate-180" />
                <p className="text-gray-600 leading-relaxed text-[15px] pl-6 italic">
                  "{testimonial.content}"
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-[#3744FB]/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img
                  src={testimonial.image}
                  className="relative w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover group-hover:scale-110 transition-transform duration-500"
                  alt={testimonial.name}
                />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-[#3744FB] transition-colors duration-300">
                  {testimonial.name}
                </h3>
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">
                  {testimonial.title}
                </p>
              </div>
            </div>

            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-transparent via-[#3744FB] to-transparent group-hover:w-1/2 transition-all duration-700 opacity-40 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
