import React from "react";
import Headers from "@/components/header";
import { Sparkles, Timer, LifeBuoy, Headphones } from "lucide-react";
const WhyUs = () => {
  const values = [
    {
      icon: Sparkles,
      title: "Transparency over illusion",
      description:
        "We are ambitious in our goals, but honest about our progress. We don't shy away from asking questions or pushing back when something doesn't make sense.",
    },
    {
      icon: Timer,
      title: "Execution over Perfection",
      description:
        "We prioritize and execute. We don't over-analyze, and are comfortable moving ahead despite ambiguity.",
    },
    {
      icon: LifeBuoy,
      title: "Autonomy over Consensus",
      description:
        "We trust individuals to make decisions, own the outcomes, and gather data from others where appropriate.",
    },
    {
      icon: Headphones,
      title: "Through customer value our ego is lost",
      description:
        "We make decisions by focusing relentlessly on customer value — and accept if this means changing our individual ideas. Customer success is team success.",
    },
  ];

  return (
    <main className="mt-10 max-w-6xl mx-auto px-4">
      {" "}
      <Headers
        label="WHY US"
        heading="What we Value at MetaUpSpace?"
        subheading=" Limitless replaces unreliable freelancers and expensive agencies for one
        flat monthly fee, with highly-converting designs delivered so fast that
        it will blow your mind."
      />
      <div className="relative mt-20">
        {/* Top-left corner registration mark */}
        <div
          aria-hidden
          className="absolute -top-20 -left-10 w-px h-[calc(100%+6rem)] bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute -top-10 left-260 h-px w-[100%] -translate-x-full bg-gradient-to-r from-white/30 via-white/10 to-transparent pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute -top-10 -left-10 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/30 pointer-events-none"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {values.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-2xl border border-white/60 bg-[#0d0d0d] p-7 transition-colors duration-300 hover:border-white/70 hover:bg-[#111111]"
            >
              <Icon className="w-7 h-7 text-white mb-8" strokeWidth={1.6} />
              <h3 className="text-[17px] font-semibold text-white mb-3">
                {title}
              </h3>
              <p className="text-[14px] leading-relaxed text-neutral-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default WhyUs;
