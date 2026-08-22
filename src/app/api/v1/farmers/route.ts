import { NextRequest, NextResponse } from "next/server"

const MOCK_FARMERS = [
  {
    address: "GCWXIWY5VLB5K5UZD5KS2M3SKG7H3RCVQ7YHBO32N44VD5XUU6HBVSXJ",
    id: "va:farmer:GCWXIWY5VLB5K5UZD5KS2M3SKG7H3RCVQ7YHBO32N44VD5XUU6HBVSXJ",
    name: "Kofi Mensah",
    region: "Ashanti",
    district: "Ejisu",
    verificationCount: 2,
  },
  {
    address: "GBQWWK3DJ7DZQQ5EV3KY3G2CWNBZ2X6Q7YHBO32N44VD5XUU6HBVSXJ",
    id: "va:farmer:GBQWWK3DJ7DZQQ5EV3KY3G2CWNBZ2X6Q7YHBO32N44VD5XUU6HBVSXJ",
    name: "Amara Okafor",
    region: "Central",
    district: "Cape Coast",
    verificationCount: 0,
  },
]

export async function GET(req: NextRequest) {
  const backendUrl = process.env.VERDANT_BACKEND_URL
  if (backendUrl) {
    const qs = req.nextUrl.search
    const res = await fetch(`${backendUrl}/api/v1/farmers${qs}`)
    const data = await res.text()
    return new NextResponse(data, {
      status: res.status,
      headers: { "content-type": "application/json" },
    })
  }

  // Dev mock — simple substring search on name/region/district
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim().toLowerCase()
  const page = Math.max(1, parseInt(req.nextUrl.searchParams.get("page") ?? "1", 10) || 1)
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt(req.nextUrl.searchParams.get("pageSize") ?? "20", 10) || 20)
  )

  let items = MOCK_FARMERS
  if (q) {
    items = MOCK_FARMERS.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        (f.region && f.region.toLowerCase().includes(q)) ||
        (f.district && f.district.toLowerCase().includes(q))
    )
  }

  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  const paged = items.slice(start, start + pageSize)

  return NextResponse.json({
    items: paged,
    pagination: { page, pageSize, total, totalPages },
  })
}
