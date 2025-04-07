import { type NextRequest, NextResponse } from "next/server"
import { mockPredictionResult } from "@/components/mock-data"

// Mock API endpoint for prediction
export async function POST(request: NextRequest) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return NextResponse.json(mockPredictionResult)
}

