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
