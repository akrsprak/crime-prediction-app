import { type NextRequest, NextResponse } from "next/server"
import { mockHotspots } from "@/components/mock-data"

// Mock API endpoint for crime hotspots
export async function GET(request: NextRequest) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return NextResponse.json({ hotspots: mockHotspots })
}

