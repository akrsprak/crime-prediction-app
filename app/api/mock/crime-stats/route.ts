import { type NextRequest, NextResponse } from "next/server"
import { mockCrimeStats } from "@/components/mock-data"

// Mock API endpoint for crime statistics
export async function GET(request: NextRequest) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return NextResponse.json(mockCrimeStats)
}

