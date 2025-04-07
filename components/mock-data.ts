// Mock data for when the API is not available

export const mockCrimeStats = {
  byMonth: [
    { month: "Jan", count: 850 },
    { month: "Feb", count: 740 },
    { month: "Mar", count: 900 },
    { month: "Apr", count: 880 },
    { month: "May", count: 940 },
    { month: "Jun", count: 1100 },
    { month: "Jul", count: 1250 },
    { month: "Aug", count: 1300 },
    { month: "Sep", count: 1150 },
    { month: "Oct", count: 1050 },
    { month: "Nov", count: 950 },
    { month: "Dec", count: 1100 },
  ],
  byType: [
    { type: "Theft", count: 4200 },
    { type: "Assault", count: 2100 },
    { type: "Burglary", count: 1800 },
    { type: "Vehicle Theft", count: 1500 },
    { type: "Robbery", count: 900 },
  ],
  byArea: [
    { area: "Downtown", count: 3500 },
    { area: "North District", count: 2800 },
    { area: "South Side", count: 2400 },
    { area: "West End", count: 1900 },
    { area: "East Side", count: 1600 },
  ],
  byTimeOfDay: [
    { timeRange: "12am-3am", count: 1800 },
    { timeRange: "3am-6am", count: 1200 },
    { timeRange: "6am-9am", count: 900 },
    { timeRange: "9am-12pm", count: 1100 },
    { timeRange: "12pm-3pm", count: 1400 },
    { timeRange: "3pm-6pm", count: 1700 },
    { timeRange: "6pm-9pm", count: 2100 },
    { timeRange: "9pm-12am", count: 2000 },
  ],
  totalCrimes: 12200,
  ruralPercentage: 30,
  urbanPercentage: 70,
  seasonalDistribution: {
    spring: 25,
    summer: 35,
    fall: 22,
    winter: 18,
  },
}

export const mockTrends = [
  {
    year: "2023",
    count: 12500,
    previousYearCount: 11800,
    percentChange: 5.9,
    increased: true,
  },
  {
    year: "2022",
    count: 11800,
    previousYearCount: 13200,
    percentChange: -10.6,
    increased: false,
  },
  {
    year: "2021",
    count: 13200,
    previousYearCount: 12100,
    percentChange: 9.1,
    increased: true,
  },
]

export const mockHotspots = [
  { area: "Downtown", count: 3500, percentage: 28.7 },
  { area: "North District", count: 2800, percentage: 23.0 },
  { area: "South Side", count: 2400, percentage: 19.7 },
  { area: "West End", count: 1900, percentage: 15.6 },
  { area: "East Side", count: 1600, percentage: 13.1 },
]

export const mockSearchResults = [
  {
    id: "1",
    description: "Suspect broke into a parked vehicle and stole personal items including a laptop and wallet.",
    similarity: 0.89,
    date: "2023-05-15",
    location: "Downtown",
    crime_type: "Vehicle Theft",
  },
  {
    id: "2",
    description: "Victim reported their car window was smashed and several items were taken from inside.",
    similarity: 0.82,
    date: "2023-06-22",
    location: "West End",
    crime_type: "Vehicle Theft",
  },
  {
    id: "3",
    description: "Suspect observed breaking into multiple vehicles in a parking garage. Stole various items.",
    similarity: 0.78,
    date: "2023-04-10",
    location: "North District",
    crime_type: "Vehicle Theft",
  },
]

export const mockPredictionResult = {
  predicted_crime_code: 510,
  predicted_crime: "Vehicle Theft",
  confidence: 0.87,
}

