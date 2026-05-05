"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Headers from '@/components/header'
import FormButton from '@/components/form/FormButton'
import CustomSelect from '@/components/form/CustomSelect'
import FullScreenPopup from '@/components/ui/FullScreenPopup'
import { ApplicationFormState, initialApplicationState, validateApplication } from '@/app/irdp/formschema/formValidator'

export default function ApplicationForm() {
  const isRegistrationOpen = true
  const [state, setState] = useState<ApplicationFormState>(initialApplicationState)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationFormState, string>>>({})
  const [popup, setPopup] = useState<{open: boolean; variant: 'success' | 'error'; text: string}>({ open: false, variant: 'success', text: '' })

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setState((s) => ({ ...s, [name]: value }))
    setErrors((s) => ({ ...s, [name]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!isRegistrationOpen) {
      setPopup({ open: true, variant: 'error', text: 'IRDP registrations are currently closed.' })
      return
    }

    // per-field validation moved to shared validator
    const nextErrors = validateApplication(state)
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    // basic validation
        if (!state.fullName || !state.email || !state.mobile) {
        setPopup({ open: true, variant: 'error', text: 'Please fill in all required fields.' })
        return
        }

    setLoading(true)
    try {
      const res = await fetch('/api/irdp-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      })

      if (!res.ok) throw new Error(await res.text())

      // show popup success and reset form + errors
      setPopup({ open: true, variant: 'success', text: 'Your IRDP application has been received!' })
      setState(initialApplicationState)
      setErrors({})
    } catch  {
      setPopup({ open: true, variant: 'error', text: 'Something went wrong while submitting your application. '  });
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="w-full" id="EnrollNow">
      <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-8 py-20">
        <Headers
          label={isRegistrationOpen ? 'is this for you?' : 'Admissions Update'}
          heading={
            isRegistrationOpen
              ? <>Start your <span className="italic playfair font-normal">IRDP</span> Journey</>
              : <>IRDP Registrations Are <span className="italic playfair font-normal">Closed</span></>
          }
          subheading={
            isRegistrationOpen
              ? 'Begin your transition from academic learning to real world engineering.'
              : 'Thank you for the overwhelming response. Applications for the current IRDP cohort are now closed.'
          }
        />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 xl:gap-0 items-start">
          <div className="flex items-start justify-center">
            <div className="w-full max-w-xl">
              <Image
                src="/irdp/Form.svg"
                alt="IRDP left"
                width={640}
                height={520}
                className="w-full max-h-[520px] object-cover rounded-2xl"
                priority
              />
            </div>
          </div>

          <div className="bg-gray-700/10 outline-1 outline-offset-[-1px] outline-white/25 backdrop-blur-sm border border-neutral-800 rounded-2xl p-4 md:p-6 shadow-sm min-h-[520px] flex flex-col justify-center">
            {isRegistrationOpen ? (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="text-sm text-neutral-400 mb-2 block">Full Name</label>
                  <input id="fullName" name="fullName" type="text" aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? 'err-fullName' : undefined} required value={state.fullName} onChange={onChange} placeholder="John Doe" className="bg-white/3 border border-white/10 rounded px-4 py-3 text-white w-full placeholder:text-neutral-500" />
                  {errors.fullName && <p id="err-fullName" className="text-sm text-red-400 mt-2">{errors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="libraryId" className="text-sm text-neutral-400 mb-2 block">Library ID</label>
                  <input id="libraryId" name="libraryId" type="text" aria-invalid={!!errors.libraryId} aria-describedby={errors.libraryId ? 'err-libraryId' : undefined} required value={state.libraryId} onChange={onChange} placeholder="e.g. FU66889" className="bg-white/3 border border-white/10 rounded px-4 py-3 text-white w-full placeholder:text-neutral-500" />
                  {errors.libraryId && <p id="err-libraryId" className="text-sm text-red-400 mt-2">{errors.libraryId}</p>}
                </div>

                <div>
                  <label htmlFor="mobile" className="text-sm text-neutral-400 mb-2 block">Mobile Number</label>
                  <input id="mobile" name="mobile" type="tel" aria-invalid={!!errors.mobile} aria-describedby={errors.mobile ? 'err-mobile' : undefined} required value={state.mobile} onChange={onChange} placeholder="+91 60008319XX" className="bg-white/3 border border-white/10 rounded px-4 py-3 text-white w-full placeholder:text-neutral-500" />
                  {errors.mobile && <p id="err-mobile" className="text-sm text-red-400 mt-2">{errors.mobile}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="text-sm text-neutral-400 mb-2 block">Email</label>
                  <input id="email" name="email" type="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'err-email' : undefined} required value={state.email} onChange={onChange} placeholder="you@example.com" className="bg-white/3 border border-white/10 rounded px-4 py-3 text-white w-full placeholder:text-neutral-500" />
                  {errors.email && <p id="err-email" className="text-sm text-red-400 mt-2">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="domain" className="text-sm text-neutral-400 mb-2 block">Domain</label>
                  <CustomSelect
                    name="domain"
                    value={state.domain}
                    onValueChange={(v) => {
                      setState((s) => ({ ...s, domain: v }))
                      setErrors((s) => ({ ...s, domain: undefined }))
                    }}
                    options={[
                      { label: 'AI Development', value: 'AI Development' },
                      { label: 'Web Fullstack Development', value: 'Web Fullstack Development' },
                    ]}
                    placeholder="Select domain"
                  />
                  {errors.domain && <p className="text-sm text-red-400 mt-2">{errors.domain}</p>}
                </div>

                <div>
                  <label htmlFor="github" className="text-sm text-neutral-400 mb-2 block">Github Profile URL</label>
                  <input id="github" name="github" type="url" aria-invalid={!!errors.github} aria-describedby={errors.github ? 'err-github' : undefined} required value={state.github} onChange={onChange} placeholder="https://github.com/your-username" className="bg-white/3 border border-white/10 rounded px-4 py-3 text-white w-full placeholder:text-neutral-500" />
                  {errors.github && <p id="err-github" className="text-sm text-red-400 mt-2">{errors.github}</p>}
                </div>
              </div>

              <div>
                <FormButton type="submit" className="mt-2" disabled={loading}>
                  {loading ? 'Submitting…' : 'Submit Application'}
                </FormButton>
              </div>

              {/* submission toast handled globally */}
            </form>
            ) : (
              <div className="h-full flex flex-col justify-center gap-6 text-white">
                <div className="rounded-xl border border-amber-300/30 bg-amber-500/10 px-5 py-4">
                  <p className="text-amber-200 text-sm md:text-base font-medium">
                    Registrations for the current IRDP batch are closed.
                  </p>
                </div>
                <div className="space-y-3 text-white/80 text-sm md:text-base leading-relaxed">
                  <p>New applications are not being accepted right now.</p>
                  <p>
                    For updates on the next cohort, follow{' '}
                    <Link
                      href="https://www.instagram.com/metaupspace/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-300 underline underline-offset-4 hover:text-cyan-200"
                    >
                      MetaUpSpace on Instagram
                    </Link>{' '}
                    or reach us via the{' '}
                    <Link
                      href="/contact"
                      className="text-cyan-300 underline underline-offset-4 hover:text-cyan-200"
                    >
                      contact form
                    </Link>
                    .
                  </p>
                </div>
                <FormButton type="button" className="mt-2" disabled>
                  Registrations Closed
                </FormButton>
              </div>
            )}
          </div>
        </div>
      </div>
      <FullScreenPopup 
        open={popup.open} 
        variant={popup.variant} 
        message={popup.text} 
        onClose={() => setPopup((s) => ({ ...s, open: false }))}
        redirectTo="/irdp"
      />
    </section>
  )
}
