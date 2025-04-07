import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper functions for crime prediction app

// Convert date string to season
export function dateToSeason(dateStr: string): string {
  const date = new Date(dateStr)
  const month = date.getMonth()

  if (month >= 2 && month <= 4) return "spring"
  if (month >= 5 && month <= 7) return "summer"
  if (month >= 8 && month <= 10) return "fall"
  return "winter"
}

// Format probability as percentage
export function formatProbability(prob: number): string {
  return `${(prob * 100).toFixed(1)}%`
}

// Check if a location is rural based on area ID (simplified logic)
export function isRuralArea(areaId: number): boolean {
  // In a real app, this would use actual geographic data
  // For demo purposes, we'll consider certain area IDs as rural
  const ruralAreaIds = [3, 5, 8, 12, 15, 17, 20]
  return ruralAreaIds.includes(areaId)
}

