import { NextRequest, NextResponse } from "next/server"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ address: string }> }) {
  const { address } = await params
  const backendUrl = process.env.VERDANT_BACKEND_URL
  if (backendUrl) {
    const body = await req.text()
    const headers: Record<string, string> = { "content-type": "application/json" }
    const auth = req.headers.get("authorization")
    if (auth) headers["authorization"] = auth
    const res = await fetch(
      `${backendUrl}/api/v1/farmers/${encodeURIComponent(address)}/metadata`,
      {
        method: "PUT",
        headers,
        body,
      }
    )
    const data = await res.text()
    return new NextResponse(data, {
      status: res.status,
      headers: { "content-type": "application/json" },
    })
  }

  // Dev mock — echo metadata update
  try {
    const body = (await req.json()) as { metadata?: unknown }
    return NextResponse.json({
      address,
      id: `va:farmer:${address}`,
      registered: true,
      createdLedger: 1234567,
      updatedLedger: 1234601,
      metadata: {
        hash: "mockhash2",
        profile: (body.metadata as Record<string, unknown>) ?? { name: address.slice(0, 8) },
      },
      verificationMarkers: [],
    })
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 })
  }
}
