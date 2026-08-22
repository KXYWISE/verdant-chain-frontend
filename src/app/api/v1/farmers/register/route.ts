import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const backendUrl = process.env.VERDANT_BACKEND_URL
  if (backendUrl) {
    const body = await req.text()
    const headers: Record<string, string> = { "content-type": "application/json" }
    const auth = req.headers.get("authorization")
    if (auth) headers["authorization"] = auth
    const res = await fetch(`${backendUrl}/api/v1/farmers/register`, {
      method: "POST",
      headers,
      body,
    })
    const data = await res.text()
    return new NextResponse(data, {
      status: res.status,
      headers: { "content-type": "application/json" },
    })
  }

  // Dev mock — echo back a registered farmer
  try {
    const body = (await req.json()) as { address?: string; metadata?: { name?: string } }
    if (!body.address) {
      return NextResponse.json({ error: "address is required" }, { status: 400 })
    }
    const auth = req.headers.get("authorization")
    if (!auth) {
      return NextResponse.json({ error: "authorization required" }, { status: 401 })
    }
    return NextResponse.json({
      address: body.address,
      id: `va:farmer:${body.address}`,
      registered: true,
      createdLedger: 1234600,
      updatedLedger: 1234600,
      metadata: {
        hash: "mockhash",
        profile: {
          name: body.metadata?.name ?? body.address.slice(0, 8),
          region: "Ashanti",
          district: "Ejisu",
          bio: "Mock farmer registered in dev.",
        },
      },
      verificationMarkers: [],
    })
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 })
  }
}
