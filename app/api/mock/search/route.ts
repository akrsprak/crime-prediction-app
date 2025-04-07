import { type NextRequest, NextResponse } from "next/server"
import { mockSearchResults } from "@/components/mock-data"

// Mock API endpoint for search
export async function POST(request: NextRequest) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  try {
    const body = await request.json()
    const query = body.query || ""

    // Filter results based on query (simple contains check)
    const results = mockSearchResults.filter((result) => result.description.toLowerCase().includes(query.toLowerCase()))

    return NextResponse.json({ results })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

