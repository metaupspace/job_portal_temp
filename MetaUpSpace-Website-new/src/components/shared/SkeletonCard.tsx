import React from "react"

export const SkeletonCard = () => (
  <div className="rounded-2xl border border-white/5 bg-[#0F1115] p-6 animate-pulse">
    <div className="h-3 bg-white/10 rounded mb-3 w-1/3" />
    <div className="h-4 bg-white/10 rounded mb-3 w-2/3" />
    <div className="h-3 bg-white/10 rounded mb-2 w-full" />
    <div className="h-3 bg-white/10 rounded mb-6 w-4/5" />
    <div className="h-10 bg-white/10 rounded-full" />
  </div>
)

export default SkeletonCard
