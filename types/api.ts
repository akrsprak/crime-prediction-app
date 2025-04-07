// Types for API responses and requests

export interface AreaName {
    id: number
    name: string
  }
  
  export interface CrimeCategory {
    id: number
    name: string
  }
  
  export interface PredictionInput {
    areaId: number
    reportingDistrict: number
    victimAge: number
    victimSex: string
    date: string
    time: string
    season: string
    description?: string
  }
  
  export interface PredictionResult {
    crimeCode: number
    crimeName: string
    probability: number
    topPredictions: Array<{
      crimeCode: number
      crimeName: string
      probability: number
    }>
  }
  
  