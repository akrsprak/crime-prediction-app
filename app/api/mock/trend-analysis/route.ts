import { type NextRequest, NextResponse } from "next/server"
import { mockTrends } from "@/components/mock-data"

// Mock API endpoint for trend analysis
export async function GET(request: NextRequest) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return NextResponse.json({ trends: mockTrends })
}

