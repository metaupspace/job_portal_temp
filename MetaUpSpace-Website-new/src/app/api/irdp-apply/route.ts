import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// This API route forwards form submissions to SheetDB endpoints.
// Configure the following environment variables in your deployment / .env:
// - SHEETDB_AI_URL   -> sheet endpoint for AI Development sheet
// - SHEETDB_WEB_URL  -> sheet endpoint for Web Fullstack development sheet
// - SHEETDB_APP_URL  -> sheet endpoint for App Development sheet
// Optionally: SHEETDB_FALLBACK_URL -> used if domain-specific urls are not set

async function forwardToSheet(url: string, payload: Record<string, unknown>) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res
}

export async function POST(req: NextRequest) {
  try {
    const isRegistrationOpen = true
    if (!isRegistrationOpen) {
      return NextResponse.json({ error: 'IRDP registrations are currently closed' }, { status: 403 })
    }

    const body = await req.json()

    // minimal validation
    const { fullName, email, mobile, domain } = body
    if (!fullName || !email || !mobile || !domain) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // const mapping: Record<string, string | undefined> = {
    //   'AI Development': process.env.SHEETDB_AI_URL,
    //   'Web Fullstack development': process.env.SHEETDB_WEB_URL,
    //   'App Development': process.env.SHEETDB_APP_URL,
    // }

    // const target = "https://sheetdb.io/api/v1/auiu0djpupvwi"
    // const newTarget = "https://sheetdb.io/api/v1/stuanbn1kkkgt"
      const newTarget = "https://sheetdb.io/api/v1/s8hm679cxbffa"

    if (!newTarget) {
      return NextResponse.json({ error: 'SheetDB endpoint not configured' }, { status: 500 })
    }

    // SheetDB expects different payload depending on provider; as a generic solution
    // wrap data under 'data' key which works with several Sheet-as-API providers.
    const payload = {
      data: {
        fullName: body.fullName,
        libraryId: body.libraryId || '',
        mobile: body.mobile,
        email: body.email,
        domain: body.domain,
        github: body.github || '',
        submittedAt: new Date().toISOString(),
      },
    }

    const res = await forwardToSheet(newTarget, payload)

    if (!res.ok) {
      const txt = await res.text()
      return NextResponse.json({ error: 'Sheet forward failed', detail: txt }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({message}, { status: 500 })
  }
}
