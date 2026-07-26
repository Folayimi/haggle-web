export interface Location {
  city: string;
  state: string;
  country: string;
}

export interface Media {
  id: string;

  url: string;

  type: "image" | "video";

  isCover?: boolean;
}

export interface Tag {
  id: string;
  label: string;
}

export interface ReviewSummary {
  rating: number;
  totalReviews: number;
}
