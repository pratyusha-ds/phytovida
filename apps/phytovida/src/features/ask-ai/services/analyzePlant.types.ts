export interface Treatment {
  prevention: string[]
  biological: string[]
  chemical: string[]
}
 
export interface DiseaseMatch {
  name: string
  commonNames: string[]
  confidence: number
  description: string
  treatment: Treatment
}
 
export interface DiagnosisResult {
  isHealthy: boolean
  healthProbability: number
  diseases: DiseaseMatch[]
  remainingRequests: number
}
 
// ─── Internal Plant.id v3 response shape ──────────────────────────────────────
 
export interface PlantIdDiseaseSuggestion {
  name: string
  probability: number
  details?: {
    common_names?: string[] | null
    description?: string | { value: string } | null
    treatment?: {
      prevention?: string[]
      biological?: string[]
      chemical?: string[]
    } | null
  }
}
 
export interface PlantIdResponse {
  result: {
    is_healthy: {
      probability: number
      binary: boolean
    }
    disease: {
      suggestions: PlantIdDiseaseSuggestion[]
    }
  }
  remaining_requests?: number
}