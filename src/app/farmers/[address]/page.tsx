import { Metadata } from "next"
import { FarmerProfileClient } from "./FarmerProfileClient"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Farmer Profile",
}

interface PageProps {
  params: Promise<{ address: string }>
}

export default async function FarmerProfilePage({ params }: PageProps) {
  const { address } = await params
  return <FarmerProfileClient address={address} />
}

export async function generateStaticParams() {
  // Dynamic route - no static params
  return []
}
