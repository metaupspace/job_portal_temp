"use client"
import React, { useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Loader from "@/components/Loader"
import { useJobsStore } from "@/store"

interface Props {
  jobId: string
}

export default function JobDetails({ jobId }: Props) {
  const { selectedJob: job, fetchJob, isLoading, error } = useJobsStore()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
    fetchJob(jobId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId])

  if (isLoading) return <Loader />

  if (error || !job) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
        <p className="sf text-white/40 mb-4">{error || "Job not found."}</p>
        <Link
          href="/careers"
          className="sf inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/70 hover:text-white hover:border-white/20"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Jobs
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black pt-28 sm:pt-32 pb-20 px-6 sm:px-10 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/careers"
          className="sf inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Jobs
        </Link>

        <h1 className="sf mt-8 sm:mt-10 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.05] tracking-tight text-white">
          {job.title}
        </h1>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-10 lg:gap-16">
          {/* Left meta column */}
          <aside className="space-y-0">
            <MetaRow label="Location" value="Remote" />
            <MetaRow
              label="Employment type"
              value="Full Time"
            />
            <MetaRow label="Department" value={job.domain} />
            <MetaRow
              label="Role Type"
              value={job.type === "tech" ? "Tech" : "Non-tech"}
            />
            <MetaRow
              label="Status"
              value={job.isActive ? "Open" : "Closed"}
            />
          </aside>

          {/* Right description column */}
          <div className="space-y-10">
            <section>
              <h2 className="sf text-2xl sm:text-3xl font-semibold text-white mb-5">
                About this role
              </h2>
              <div className="sf space-y-4 text-[15px] sm:text-base leading-relaxed text-white/60">
                {job.description.split(/\n\s*\n/).map((para, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {para}
                  </p>
                ))}
              </div>
            </section>

            {job.requirements.length > 0 && (
              <section>
                <h2 className="sf text-2xl sm:text-3xl font-semibold text-white mb-5">
                  Requirements
                </h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, i) => (
                    <li
                      key={i}
                      className="sf flex gap-3 text-[15px] sm:text-base leading-relaxed text-white/60"
                    >
                      <span className="text-blue-400 mt-1.5 shrink-0">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="pt-2">
              {job.isActive ? (
                <Link
                  href={`/careers/${job.slug}/apply`}
                  className="sf max-w-[200px] flex items-center justify-center gap-3 rounded-2xl bg-[#2F6BFF] py-4 text-base sm:text-lg font-medium text-white shadow-[0_8px_30px_-8px_rgba(47,107,255,0.6)] hover:bg-[#3A77FF] active:scale-[0.99] transition-all"
                >
                  Apply Now
                  <ArrowRight className="h-5 w-5" strokeWidth={2.25} />
                </Link>
              ) : (
                <div className="sf w-full rounded-2xl border border-white/10 bg-white/[0.02] py-4 sm:py-5 text-center text-base text-white/40">
                  Applications closed
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/30 py-5 first:pt-0">
      <p className="sf text-[13px] text-white/50 mb-1.5">{label}</p>
      <p className="sf text-base text-white">{value}</p>
    </div>
  )
}
