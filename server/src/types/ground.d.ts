export interface GroundData {
  groundName: string;
  location: string;
  description?: string;
  type: string;
    media?: string[];
      availability?: boolean;
}

export interface UpdateGroundData {
  groundName?: string;
  location?: string;
  description?: string;
  type?: string;
  media?: string[];
  availability?: boolean;
}
