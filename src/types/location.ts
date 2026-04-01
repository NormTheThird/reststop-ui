// location.ts
export type PlaceType = 'GasStation' | 'RestStop' | 'Restaurant';
export type RestroomType = 'Male' | 'Female' | 'Family' | 'GenderNeutral';

export interface RestroomSummary {
  id: string;
  type: RestroomType;
  avgCleanliness: number;
  avgSmell: number;
  avgSupplies: number;
  avgOverall: number;
  reviewCount: number;
  hasBabyStation: boolean;
  hasShower: boolean;
  isAccessible: boolean;
}

export interface LocationSummary {
  id: string;
  name: string;
  brand: string | null;
  lat: number;
  lng: number;
  distanceMetres: number;
  avgOverall: number;
  totalReviews: number;
  is24Hr: boolean;
}

export interface LocationDetail {
  id: string;
  name: string;
  address: string;
  brand: string | null;
  lat: number;
  lng: number;
  is24Hr: boolean;
  hoursOpen: string | null;
  claimedByOwner: boolean;
  restrooms: RestroomSummary[];
}

export interface CreateLocationRequest {
  name: string;
  address: string;
  lat: number;
  lng: number;
  brand?: string;
  placeType: PlaceType;
  is24Hr: boolean;
  hoursOpen?: string;
}
