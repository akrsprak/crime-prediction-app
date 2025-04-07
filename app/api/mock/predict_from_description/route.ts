import { type NextRequest, NextResponse } from "next/server"
import { mockPredictionResult } from "@/components/mock-data"

// Mock API endpoint for prediction from description
export async function POST(request: NextRequest) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1200))

  return NextResponse.json({
    ...mockPredictionResult,
    confidence: 0.76, // Slightly lower confidence for text-based prediction
  })
}

