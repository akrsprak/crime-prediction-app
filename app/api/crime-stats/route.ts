import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const year = searchParams.get("year") || "2023"
    const area = searchParams.get("area") || "all"

    // In a real application, you would:
    // 1. Connect to your database
    // 2. Query for statistics based on the parameters
    // 3. Process and return the data

    // For this demo, we'll generate simulated statistics
    const stats = generateSimulatedStats(year, area)

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching crime statistics:", error)
    return NextResponse.json({ error: "Failed to fetch crime statistics" }, { status: 500 })
  }
}

function generateSimulatedStats(year: string, area: string) {
  // Generate random but somewhat realistic data
  const yearSeed = Number.parseInt(year)
  const isRural = area === "rural"
  const isUrban = area === "urban"
  const isAll = area === "all"

  // Total crimes - vary by year and area type
  let totalCrimes = 10000 + (yearSeed - 2020) * 500
  if (isRural) totalCrimes = Math.round(totalCrimes * 0.4)
  if (isUrban) totalCrimes = Math.round(totalCrimes * 0.6)

  // Rural/Urban percentages
  const ruralPercentage = isRural ? 100 : isUrban ? 0 : 40
  const urbanPercentage = isUrban ? 100 : isRural ? 0 : 60

  // Monthly distribution - more crimes in summer months
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const byMonth = monthNames.map((month, index) => {
    // Summer months (5-8) have more crimes
    const isSummer = index >= 5 && index <= 8
    const isWinter = index <= 1 || index >= 10

    let factor = 1
    if (isSummer) factor = 1.3
    if (isWinter) factor = 0.8

    // Rural areas have different seasonal patterns
    if (isRural && isSummer) factor *= 1.2
    if (isUrban && isWinter) factor *= 0.9

    return {
      month,
      count: Math.round((totalCrimes / 12) * factor * (0.9 + Math.random() * 0.2)),
    }
  })

  // Crime types - different distributions for rural vs urban
  const crimeTypes = ["Burglary", "Robbery", "Assault", "Vehicle Theft", "Theft", "Vandalism", "Drug Offenses", "Fraud"]

  const byType = crimeTypes
    .map((type) => {
      let factor = 1

      // Adjust based on crime type and area
      if (type === "Burglary" && isRural) factor = 1.5
      if (type === "Robbery" && isUrban) factor = 1.4
      if (type === "Vehicle Theft" && isRural) factor = 0.7
      if (type === "Drug Offenses" && isUrban) factor = 1.3

      return {
        type,
        count: Math.round((totalCrimes / crimeTypes.length) * factor * (0.8 + Math.random() * 0.4)),
      }
    })
    .sort((a, b) => b.count - a.count)

  // Areas - generate some area names
  const areaNames = isRural
    ? ["North County", "East Farmlands", "Western Hills", "South Valley", "Central Basin"]
    : isUrban
      ? ["Downtown", "Westside", "Eastside", "Northend", "Southside"]
      : ["Downtown", "Westside", "North County", "East Farmlands", "Southside"]

  const byArea = areaNames
    .map((area) => ({
      area,
      count: Math.round((totalCrimes / areaNames.length) * (0.7 + Math.random() * 0.6)),
    }))
    .sort((a, b) => b.count - a.count)

  // Time of day distribution
  const timeRanges = ["Morning (6-12)", "Afternoon (12-18)", "Evening (18-24)", "Night (0-6)"]
  const byTimeOfDay = timeRanges.map((timeRange) => {
    let factor = 1

    // More crimes at night in urban areas, more in daytime in rural
    if (timeRange === "Night (0-6)" && isUrban) factor = 1.6
    if (timeRange === "Night (0-6)" && isRural) factor = 0.8
    if (timeRange === "Afternoon (12-18)" && isRural) factor = 1.3

    return {
      timeRange,
      count: Math.round((totalCrimes / timeRanges.length) * factor * (0.9 + Math.random() * 0.2)),
    }
  })

  // Seasonal distribution
  const seasonalDistribution = {
    spring: isRural ? 22 + Math.random() * 5 : 24 + Math.random() * 4,
    summer: isRural ? 32 + Math.random() * 6 : 28 + Math.random() * 5,
    fall: isRural ? 26 + Math.random() * 4 : 25 + Math.random() * 3,
    winter: isRural ? 20 + Math.random() * 3 : 23 + Math.random() * 4,
  }

  // Normalize to ensure they sum to 100
  const seasonalTotal = Object.values(seasonalDistribution).reduce((a, b) => a + b, 0)
  Object.keys(seasonalDistribution).forEach((key) => {
    seasonalDistribution[key as keyof typeof seasonalDistribution] = Math.round(
      (seasonalDistribution[key as keyof typeof seasonalDistribution] / seasonalTotal) * 100,
    )
  })

  // Ensure they sum to exactly 100
  const adjustedTotal = Object.values(seasonalDistribution).reduce((a, b) => a + b, 0)
  if (adjustedTotal !== 100) {
    const diff = 100 - adjustedTotal
    seasonalDistribution.summer += diff
  }

  return {
    byMonth,
    byType,
    byArea,
    byTimeOfDay,
    totalCrimes,
    ruralPercentage,
    urbanPercentage,
    seasonalDistribution,
  }
}

