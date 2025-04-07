import { type NextRequest, NextResponse } from "next/server"

// In a real application, you would load the actual model
// For this demo, we'll simulate the model's behavior
const crimeMapping: Record<number, string> = {
  310: "Burglary",
  210: "Robbery",
  230: "Assault with Deadly Weapon",
  624: "Battery - Simple Assault",
  330: "Burglary from Vehicle",
  510: "Vehicle - Stolen",
  626: "Intimate Partner - Simple Assault",
  440: "Theft Plain - Petty",
  740: "Vandalism",
  420: "Theft from Motor Vehicle",
  // Add more mappings as needed
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Extract features from the request
    const { areaId, reportingDistrict, victimAge, victimSex, date, timeHour, timeMinute, season } = data

    // In a real application, you would:
    // 1. Preprocess the input data
    // 2. Load the trained model
    // 3. Make a prediction using the model

    // For this demo, we'll simulate a prediction
    const simulatePrediction = () => {
      // Simulate different predictions based on input features
      let predictedCrimeCode: number

      // Time-based logic
      if (timeHour >= 22 || timeHour <= 4) {
        // Night crimes
        predictedCrimeCode = areaId <= 10 ? 210 : 310 // Robbery in urban areas, Burglary in others
      } else if (timeHour >= 12 && timeHour <= 18) {
        // Afternoon crimes
        predictedCrimeCode = areaId <= 10 ? 624 : 330 // Battery in urban areas, Burglary from Vehicle in others
      } else {
        // Morning/evening crimes
        predictedCrimeCode = areaId <= 10 ? 440 : 510 // Theft in urban areas, Vehicle Stolen in others
      }

      // Season-based adjustments
      if (season === "summer" && areaId <= 10) {
        // More assaults in summer in urban areas
        predictedCrimeCode = 230
      } else if (season === "winter" && areaId > 10) {
        // More burglaries in winter in rural areas
        predictedCrimeCode = 310
      }

      // Generate top predictions with probabilities
      const mainProbability = 0.4 + Math.random() * 0.3 // Between 0.4 and 0.7

      // Generate other possible crimes with lower probabilities
      const otherCrimeCodes = Object.keys(crimeMapping)
        .map(Number)
        .filter((code) => code !== predictedCrimeCode)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)

      const remainingProbability = 1 - mainProbability
      const otherProbabilities = otherCrimeCodes.map((_, index) => {
        if (index === otherCrimeCodes.length - 1) {
          return remainingProbability - otherProbabilities.reduce((a, b) => a + b, 0)
        }
        return (remainingProbability * Math.random()) / otherCrimeCodes.length
      })

      const topPredictions = [
        {
          crimeCode: predictedCrimeCode,
          crimeName: crimeMapping[predictedCrimeCode] || "Unknown Crime",
          probability: mainProbability,
        },
        ...otherCrimeCodes.map((code, index) => ({
          crimeCode: code,
          crimeName: crimeMapping[code] || "Unknown Crime",
          probability: otherProbabilities[index],
        })),
      ]

      return {
        crimeCode: predictedCrimeCode,
        crimeName: crimeMapping[predictedCrimeCode] || "Unknown Crime",
        probability: mainProbability,
        topPredictions,
      }
    }

    const prediction = simulatePrediction()

    return NextResponse.json(prediction)
  } catch (error) {
    console.error("Error predicting crime:", error)
    return NextResponse.json({ error: "Failed to predict crime" }, { status: 500 })
  }
}

