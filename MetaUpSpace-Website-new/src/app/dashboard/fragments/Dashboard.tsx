"use client"
import React, { useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  LogOut,
  Pencil,
  Clock,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from "lucide-react"
import { useAuthStore, useApplicationStore } from "@/store"
import Loader from "@/components/Loader"
import type { ApplicationStatus } from "@/types"

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  reviewed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  shortlisted: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  hired: "bg-green-500/10 text-green-400 border-green-500/20",
  withdrawn: "bg-white/5 text-white/40 border-white/10",
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function formatToday(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

function getInitials(name?: string, email?: string): string {
  const source = (name || email || "U").trim()
  const parts = source.split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

export default function Dashboard() {
  const router = useRouter()
  const { step, profile, fetchProfile, logout } = useAuthStore()
  const {
    myApplications,
    isLoadingApplications,
    applicationsError,
    fetchMyApplications,
    withdrawApplication,
  } = useApplicationStore()

  useEffect(() => {
    if (step !== "authenticated") {
      router.replace("/careers")
      return
    }
    if (!profile) fetchProfile()
    fetchMyApplications()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const stats = useMemo(() => {
    const total = myApplications.length
    const pending = myApplications.filter((a) => a.status === "pending").length
    const inProgress = myApplications.filter(
      (a) => a.status === "reviewed" || a.status === "shortlisted",
    ).length
    const successful = myApplications.filter((a) => a.status === "hired").length
    return { total, pending, inProgress, successful }
  }, [myApplications])

  if (step !== "authenticated") return <Loader />

  const displayName = profile?.fullName || profile?.email?.split("@")[0] || "there"
  const initials = getInitials(profile?.fullName, profile?.email)

  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 lg:mb-10">
          <div className="min-w-0">
            <p className="sf text-[0.7875rem] text-white/40 mb-2">{formatToday()}</p>
            <h1 className="text-[1.575rem] sm:text-[1.96875rem] lg:text-[42px] leading-tight font-medium text-white">
              Take a look at your profile,{" "}
              <span className="playfair italic font-medium bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                {displayName}!
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => router.push("/dashboard/edit-profile")}
              className="sf inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[0.91875rem] font-medium text-white/70 active:scale-[0.98] border border-white/20 hover:border-white/30 hover:text-white/80 hover:bg-white/5 transition-all"
            >
              <Pencil size={14} />
              Edit Profile
            </button>
            <button
              onClick={() => {
                logout()
                router.push("/careers")
              }}
              className="sf inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-3 text-[0.91875rem] text-white/70  hover:border-red-400/40 hover:bg-red-500/5 hover:text-red-400 active:scale-[0.98] transition-all"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>

        {/* Profile compact strip */}
        {profile && (
          <div className="mb-6 lg:mb-8 flex items-center gap-4">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-blue-500/30 via-blue-600/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-[1.18125rem] sm:text-[1.3125rem] font-semibold text-white/90">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="sf text-[1.05rem] sm:text-[1.18125rem] font-semibold truncate">
                {profile.fullName || "Applicant"}
              </p>
              <p className="sf text-[0.91875rem] text-white/50 truncate">{profile.email}</p>
            </div>
          </div>
        )}

        {/* Two-column grid: details + activity, with right rail */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 lg:gap-8">
          <div className="space-y-6 min-w-0">
            {/* Applicant + Activity grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
              <SectionCard label="Applicant Details">
                <DetailRow label="Full Name" value={profile?.fullName} />
                <DetailRow label="Contact" value={profile?.contactNumber} />
                <DetailRow label="WhatsApp" value={profile?.whatsappNumber} />
                <DetailRow label="Location" value={profile?.currentLocation} />
                <LinkedInRow value={profile?.linkedinId} />
                <DetailRow label="Qualification" value={profile?.qualification} />
                <DetailRow label="Experience" value={profile?.experience} />
              </SectionCard>

              <SectionCard label="Application Activity">
                <ActivityRow
                  label="Total Applications"
                  value={stats.total.toString()}
                />
                <ActivityRow
                  label="Pending Review"
                  value={stats.pending.toString()}
                />
                <ActivityRow
                  label="In Progress"
                  value={stats.inProgress.toString()}
                />
                <ActivityRow
                  label="Successful"
                  value={stats.successful.toString()}
                />
                <ActivityRow
                  label="Resume"
                  value={profile?.resumeUrl ? "Uploaded" : "Not provided"}
                />
              </SectionCard>
            </div>

            {/* Applications list */}
            <div className="rounded-2xl border border-white/5 bg-[#0F1115] p-5 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="sf text-[11.55px] uppercase tracking-[0.2em] text-white/40">
                  My Applications
                </p>
                <Link
                  href="/careers"
                  className="sf text-[0.7875rem] text-blue-400 hover:text-blue-300"
                >
                  Browse roles →
                </Link>
              </div>

              {isLoadingApplications && (
                <p className="sf text-[0.91875rem] text-white/40 py-6 text-center">Loading…</p>
              )}

              {applicationsError && (
                <p className="sf text-[0.91875rem] text-red-400 py-4">{applicationsError}</p>
              )}

              {!isLoadingApplications &&
                !applicationsError &&
                myApplications.length === 0 && (
                  <div className="text-center py-10">
                    <p className="sf text-[0.91875rem] text-white/40">
                      You haven&apos;t applied to any roles yet.
                    </p>
                    <Link
                      href="/careers"
                      className="sf inline-block mt-3 text-[0.91875rem] text-blue-400 hover:text-blue-300"
                    >
                      Explore open roles →
                    </Link>
                  </div>
                )}

              {myApplications.length > 0 && (
                <ul className="divide-y divide-white/5">
                  {myApplications.map((app) => (
                    <li
                      key={app.applicationId}
                      className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="sf text-[0.91875rem] sm:text-[1.05rem] text-white truncate">
                          {app.jobTitle}
                        </p>
                        <p className="sf text-[0.7875rem] text-white/40 mt-1">
                          Submitted {formatDate(app.appliedAt)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span
                          className={`sf inline-block rounded-full border px-2.5 py-0.5 text-[10.5px] uppercase tracking-wider ${
                            STATUS_STYLES[app.status]
                          }`}
                        >
                          {app.status}
                        </span>
                        {app.status === "pending" && (
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  "Withdraw this application? This cannot be undone.",
                                )
                              ) {
                                withdrawApplication(app.applicationId)
                              }
                            }}
                            className="sf text-[0.7875rem] text-white/40 hover:text-red-400 transition-colors"
                          >
                            Withdraw
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right rail tiles */}
          <aside className="flex flex-col gap-4 h-full">
            <StatTile
              title="ACTIVE"
              subtitle="Profile Status"
              icon={<CheckCircle2 size={25} />}
              iconBg="bg-emerald-500/15 text-emerald-400"
            />
            <StatTile
              title={`${stats.pending}`}
              subtitle={
                stats.pending === 1 ? "Pending Review" : "Pending Reviews"
              }
              icon={<Clock size={25} />}
              iconBg="bg-yellow-500/15 text-yellow-400"
            />
            <StatTile
              title={`${stats.inProgress}`}
              subtitle={
                stats.inProgress === 1 ? "In Conversation" : "In Conversations"
              }
              icon={<Sparkles size={25} />}
              iconBg="bg-purple-500/15 text-purple-400"
            />
          </aside>
        </div>
      </div>
    </main>
  )
}

function SectionCard({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0F1115] p-5 sm:p-6">
      <p className="sf text-[11.55px] uppercase tracking-[0.2em] text-white/40 mb-5">
        {label}
      </p>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value?: string | null
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="sf text-[0.91875rem] text-white/50 shrink-0">{label}</p>
      <p className="sf text-[0.91875rem] text-white/90 text-right break-all min-w-0">
        {value || "—"}
      </p>
    </div>
  )
}

function LinkedInRow({ value }: { value?: string | null }) {
  const href = value
    ? value.startsWith("http://") || value.startsWith("https://")
      ? value
      : `https://${value}`
    : null

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="sf text-[0.91875rem] text-white/50 shrink-0">LinkedIn</p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="sf inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[0.7875rem] font-medium text-blue-300 hover:bg-blue-500/20 hover:text-blue-200 transition-colors"
        >
          View LinkedIn
          <ExternalLink size={12} />
        </a>
      ) : (
        <p className="sf text-[0.91875rem] text-white/90">—</p>
      )}
    </div>
  )
}

function ActivityRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="sf text-[0.91875rem] text-white/50">{label}</p>
      <p className="sf text-[0.91875rem] font-medium text-white">{value}</p>
    </div>
  )
}

function StatTile({
  title,
  subtitle,
  icon,
  iconBg,
}: {
  title: string
  subtitle: string
  icon: React.ReactNode
  iconBg: string
}) {
  return (
    <div className="flex-1 rounded-2xl border border-white/5 bg-[#0F1115] p-5 flex items-center justify-between">
      <div>
        <p className="sf text-[1.3125rem] sm:text-[1.575rem] font-semibold text-white">{title}</p>
        <p className="sf text-[0.7875rem] text-white/50 mt-1">{subtitle}</p>
      </div>
      <div
        className={`h-15 w-15 rounded-full flex items-center justify-center ${iconBg}`}
      >
        {icon}
      </div>
    </div>
  )
}
