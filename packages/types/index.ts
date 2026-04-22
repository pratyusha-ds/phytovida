// Dashboard
export interface Plant {
  id: number;
  name: string;
  image: string | null;
  waterFrequency: number;
  lastWatered: string | null;
}

export interface DashboardResponse {
  location: string;
  plants: Plant[];
}

// Perenual API
export interface PerenualPlant {
  id: number;
  common_name: string;
  default_image?: { medium_url: string };
  hardiness?: { min: string; max: string };
}

export interface PerenualResponse {
  data: PerenualPlant[];
}