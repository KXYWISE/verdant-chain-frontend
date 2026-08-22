import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ address: string }> }) {
  const { address } = await params
  const backendUrl = process.env.VERDANT_BACKEND_URL
  if (backendUrl) {
    const res = await fetch(`${backendUrl}/api/v1/farmers/${encodeURIComponent(address)}`)
    const data = await res.text()
    return new NextResponse(data, {
      status: res.status,
      headers: { "content-type": "application/json" },
    })
  }

  // Dev mock — return a fake farmer for the known mock address, 404 otherwise
  if (address === "GCWXIWY5VLB5K5UZD5KS2M3SKG7H3RCVQ7YHBO32N44VD5XUU6HBVSXJ") {
    return NextResponse.json({
      address,
      id: `va:farmer:${address}`,
      registered: true,
      createdLedger: 1234567,
      updatedLedger: 1234590,
      metadata: {
        hash: "abc123",
        profile: {
          name: "Kofi Mensah",
          region: "Ashanti",
          district: "Ejisu",
          bio: "Organic cocoa and maize farmer.",
        },
      },
      verificationMarkers: [
        {
          kind: "kyc",
          issuer: "va:farmer:GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          issuedLedger: 1234568,
        },
        {
          kind: "organic_certified",
          issuer: "va:farmer:GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
          issuedLedger: 1234570,
        },
      ],
    })
  }

  // Unknown farmer — 404 is expected and handled as "Farmer not found" in UI
  return NextResponse.json({ error: "farmer not found" }, { status: 404 })
}

export async function POST() {
  // Farmers register endpoint: /api/v1/farmers/register is handled separately,
  // but also allow POST to /api/v1/farmers/[address]/metadata for updates
  return NextResponse.json({ error: "use /api/v1/farmers/register" }, { status: 404 })
}
