"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Headers from "@/components/header";
import { useOpenRoles } from "@/hooks/useOpenRoles";
import type { Job } from "@/types";

const SkeletonCard = () => (
  <div className="rounded-2xl border border-white/5 bg-[#0F1115] p-6 animate-pulse">
    <div className="h-3 bg-white/10 rounded mb-3 w-1/3" />
    <div className="h-4 bg-white/10 rounded mb-3 w-2/3" />
    <div className="h-3 bg-white/10 rounded mb-2 w-full" />
    <div className="h-3 bg-white/10 rounded mb-6 w-4/5" />
    <div className="h-10 bg-white/10 rounded-full" />
  </div>
);

const RoleCard = ({ job }: { job: Job }) => (
  <article className="group relative flex flex-col rounded-2xl border border-white/5 bg-[#0F1115] p-6 transition-colors duration-300 hover:border-white/10 hover:bg-[#12151A]">
    <p className="mb-3 text-[13px] font-normal text-zinc-400">{job.domain}</p>
    <h3 className="mb-3 text-[17px] font-semibold leading-snug tracking-tight text-white">
      {job.title}
    </h3>
    <p className="mb-6 text-[14px] leading-relaxed text-zinc-400 line-clamp-3">
      {job.description}
    </p>
    <Link
      href={`/careers/${job.slug}`}
      className="mt-auto flex w-full items-center justify-center gap-2 rounded-full bg-[#2F6BFF] py-3 text-[14px] font-medium text-white shadow-[0_4px_24px_-8px_rgba(47,107,255,0.6)] transition-transform duration-200 hover:bg-[#3A77FF] active:scale-[0.98]"
    >
      View Details
      <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
    </Link>
  </article>
);

// Ambient background dots — kept from original design
const STARS = [
  { top: "4%", left: "52%", size: 6, opacity: 0.95, blur: 0 },
  { top: "8%", left: "78%", size: 8, opacity: 0.55, blur: 6 },
  { top: "18%", left: "94%", size: 4, opacity: 0.8, blur: 0 },
  { top: "26%", left: "6%", size: 10, opacity: 0.4, blur: 8 },
  { top: "34%", left: "88%", size: 3, opacity: 0.9, blur: 0 },
  { top: "46%", left: "2%", size: 5, opacity: 0.6, blur: 2 },
  { top: "62%", left: "97%", size: 9, opacity: 0.45, blur: 8 },
  { top: "72%", left: "10%", size: 4, opacity: 0.7, blur: 0 },
  { top: "84%", left: "60%", size: 6, opacity: 0.5, blur: 4 },
  { top: "92%", left: "30%", size: 3, opacity: 0.8, blur: 0 },
];

export function OpenRoles() {
  const { jobs, tabs, activeTab, setActiveTab, isLoading, error, retry } =
    useOpenRoles();

  return (
    <section className="relative isolate min-h-screen w-full overflow-hidden bg-black px-6 font-sans antialiased sm:px-10 lg:px-16">
      {/* Ambient stars */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: s.top,
              left: s.left,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              filter: s.blur ? `blur(${s.blur}px)` : "none",
            }}
          />
        ))}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <Headers
          label="OPENINGS"
          heading="See all Open roles"
          subheading="AI solutions across industries, making innovation practical, efficient, and results-driven."
        />

        {/* Tabs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={[
                  "rounded-full px-5 py-2.5 text-[14px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-b from-[#3A77FF] to-[#2256E0] text-white shadow-[0_6px_20px_-6px_rgba(47,107,255,0.7)]"
                    : "border border-white/12 bg-transparent text-white/85 hover:border-white/25 hover:bg-white/5",
                ].join(" ")}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Error state */}
        {error && (
          <div className="mt-12 flex flex-col items-center gap-4 text-center">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={retry}
              disabled={isLoading}
              className="rounded-full border border-white/20 px-5 py-2 text-sm text-white hover:bg-white/5 disabled:opacity-50"
            >
              Retry
            </button>
          </div>
        )}

        {/* Cards */}
        {!error && (
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            ) : jobs.length === 0 ? (
              <p className="col-span-full text-center text-white/40 py-12">
                {activeTab === "All"
                  ? "No open roles right now."
                  : `No ${activeTab} roles right now.`}
              </p>
            ) : (
              jobs.map((job) => <RoleCard key={job._id} job={job} />)
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default OpenRoles;
