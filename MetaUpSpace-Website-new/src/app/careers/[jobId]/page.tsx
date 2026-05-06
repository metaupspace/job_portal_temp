"use client"
import { useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useJobsStore } from "@/store"

const SkeletonDetail = () => (
  <div className="animate-pulse max-w-3xl mx-auto px-6 py-16">
    <div className="h-4 bg-white/10 rounded w-24 mb-10" />
    <div className="h-3 bg-white/10 rounded w-20 mb-4" />
    <div className="h-8 bg-white/10 rounded w-2/3 mb-6" />
    <div className="space-y-2 mb-10">
      <div className="h-3 bg-white/10 rounded w-full" />
      <div className="h-3 bg-white/10 rounded w-5/6" />
      <div className="h-3 bg-white/10 rounded w-4/5" />
    </div>
    <div className="h-5 bg-white/10 rounded w-32 mb-4" />
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-3 bg-white/10 rounded w-3/4" />
      ))}
    </div>
  </div>
)

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const { selectedJob: job, fetchJob, isLoading, error, clearSelectedJob, clearError } = useJobsStore()

  useEffect(() => {
    clearSelectedJob()
    clearError()
    fetchJob(jobId)
    // clearSelectedJob, clearError and fetchJob are stable Zustand action refs — safe to omit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <SkeletonDetail />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <p className="text-white/40 text-sm">Something went wrong. Please try again.</p>
        <button
          onClick={() => fetchJob(jobId)}
          className="text-[#2F6BFF] text-sm hover:underline"
        >
          Retry
        </button>
        <Link href="/careers" className="text-zinc-500 text-sm hover:underline">
          ← Back to Careers
        </Link>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <p className="text-white/40 text-sm">This role is no longer available.</p>
        <Link href="/careers" className="text-[#2F6BFF] text-sm hover:underline">
          ← Back to Careers
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Back link */}
        <Link
          href="/careers"
          className="inline-flex items-center gap-2 text-zinc-400 text-sm hover:text-white transition-colors mb-10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Careers
        </Link>

        {/* Domain + type badges */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs uppercase tracking-widest bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
            {job.domain}
          </span>
          <span className="text-xs border border-white/10 rounded-full px-3 py-1 text-zinc-400">
            {job.type === "TECH" ? "Tech" : "Non-Tech"}
          </span>
        </div>

        {/* Title */}
        <h1 className="sf text-3xl font-semibold text-white mb-6 leading-snug">
          {job.title}
        </h1>

        {/* Description */}
        <p className="text-zinc-400 text-[15px] leading-relaxed mb-10">
          {job.description}
        </p>

        {/* Requirements */}
        {job.requirements.length > 0 && (
          <div className="mb-12">
            <h2 className="text-white text-lg font-semibold mb-4">Requirements</h2>
            <ul className="space-y-3">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-400 text-[14px]">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#2F6BFF] flex-shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Apply CTA */}
        <Link
          href={`/careers/${job.slug}/apply`}
          className="inline-flex items-center gap-2 rounded-full bg-[#2F6BFF] px-8 py-3.5 text-[14px] font-medium text-white shadow-[0_4px_24px_-8px_rgba(47,107,255,0.6)] transition-transform duration-200 hover:bg-[#3A77FF] active:scale-[0.98]"
        >
          Apply Now
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Link>
      </main>
    </div>
  )
}
