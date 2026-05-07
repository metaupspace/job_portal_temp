"use client"
import React, { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore, useApplicationStore } from "@/store"
import Loader from "@/components/Loader"
import type { ApplicationStatus } from "@/types"

const cardClass =
  "rounded-2xl border border-white/5 bg-[#0F1115] p-6 space-y-4"

const sectionLabelClass =
  "sf text-xs uppercase tracking-widest bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 bg-clip-text text-transparent"

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

  if (step !== "authenticated") {
    return <Loader />
  }

  return (
    <main className="min-h-screen bg-black pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <p className={sectionLabelClass}>My Dashboard</p>
            <h1 className="sf text-2xl font-semibold text-white mt-1">
              {profile?.fullName || profile?.email || "Welcome"}
            </h1>
          </div>
          <button
            onClick={() => {
              logout()
              router.push("/careers")
            }}
            className="sf rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 hover:text-white hover:border-red-400/40 hover:bg-red-500/5 active:scale-[0.98] transition-all"
          >
            Log out
          </button>
        </div>

        {profile && (
          <div className={cardClass}>
            <p className={sectionLabelClass}>Profile</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <ProfileRow label="Email" value={profile.email} />
              <ProfileRow label="Phone" value={profile.contactNumber} />
              <ProfileRow label="Location" value={profile.currentLocation} />
              <ProfileRow label="LinkedIn" value={profile.linkedinId} />
              <ProfileRow
                label="Qualification"
                value={profile.qualification}
              />
              <ProfileRow label="Experience" value={profile.experience} />
            </div>
          </div>
        )}

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <p className={sectionLabelClass}>My Applications</p>
            <Link
              href="/careers"
              className="sf text-xs text-white/40 hover:text-white/80"
            >
              Browse roles →
            </Link>
          </div>

          {isLoadingApplications && (
            <p className="sf text-sm text-white/40">Loading…</p>
          )}

          {applicationsError && (
            <p className="sf text-sm text-red-400">{applicationsError}</p>
          )}

          {!isLoadingApplications && !applicationsError && myApplications.length === 0 && (
            <p className="sf text-sm text-white/40 py-4">
              You haven&apos;t applied to any roles yet.
            </p>
          )}

          {myApplications.length > 0 && (
            <ul className="space-y-3">
              {myApplications.map((app) => (
                <li
                  key={app.applicationId}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex items-start justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="sf text-sm text-white truncate">
                      {app.jobTitle}
                    </p>
                    <p className="sf text-xs text-white/40 mt-1">
                      Submitted {formatDate(app.appliedAt)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`sf inline-block rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${
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
                        className="sf text-xs text-white/40 hover:text-red-400 transition-colors"
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
    </main>
  )
}

function ProfileRow({
  label,
  value,
}: {
  label: string
  value: string | undefined
}) {
  return (
    <div>
      <p className="sf text-xs text-white/40">{label}</p>
      <p className="sf text-sm text-white/80 break-all">{value || "—"}</p>
    </div>
  )
}
