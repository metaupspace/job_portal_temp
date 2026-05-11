"use client"


import Headers from "@/components/header"
import { SkeletonCard } from "@/components/shared"
import { useOpenRoles } from "@/hooks"
import RoleCard from "./fragments/RoleCard"

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
    <section className="relative isolate min-h-screen w-full overflow-hidden bg-black px-4 py-12 sm:px-6 sm:py-16 md:px-10 lg:px-16 font-sans antialiased">
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
          label={jobs.length > 0 ? `${jobs.length} OPENINGS` : "NO OPENINGS"}
          heading="See all Open roles"
          subheading="AI solutions across industries, making innovation practical, efficient, and results-driven."
        />

        {/* Tabs */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={[
                  "rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-[13px] sm:text-[14px] font-medium transition-all duration-200",
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
          isLoading ? (
            <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : jobs.length === 0 ? (
            <p className="mt-8 sm:mt-12 text-center text-white/40 py-12">
              {activeTab === 'All'
                ? 'No open roles right now.'
                : `No ${activeTab} roles right now.`}
            </p>
          ) : jobs.length === 1 ? (
            <div className="mt-8 sm:mt-12 flex justify-center">
              <div className="w-full sm:max-w-md">
                <RoleCard job={jobs[0]} />
              </div>
            </div>
          ) : (
            <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => <RoleCard key={job._id} job={job} />)}
            </div>
          )
        )}
      </div>
    </section>
  );
}

export default OpenRoles;
