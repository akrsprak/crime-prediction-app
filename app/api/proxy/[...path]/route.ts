import { type NextRequest, NextResponse } from "next/server"

// This is a simple API proxy to avoid CORS issues when developing locally
// In production, you would configure CORS on your Flask backend

const API_BASE_URL = process.env.API_URL || "http://localhost:5000"

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/")
  const url = new URL(request.url)
  const queryString = url.search

  try {
    const response = await fetch(`${API_BASE_URL}/${path}${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error proxying GET request to /${path}:`, error)
    return NextResponse.json({ error: "Failed to fetch data from backend" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/")

  try {
    const body = await request.json()

    const response = await fetch(`${API_BASE_URL}/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error proxying POST request to /${path}:`, error)
    return NextResponse.json({ error: "Failed to send data to backend" }, { status: 500 })
  }
}

