// Configuration for API endpoints
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// Helper function to build API URLs
export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`
}

// Helper function for API requests with error handling
export async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `API request failed with status ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API request error for ${url}:`, error)
    throw error
  }
}

