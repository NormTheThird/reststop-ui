// review.ts
export interface Review {
  id: string;
  restroomId: string;
  reviewerName: string;
  cleanliness: number;
  smell: number;
  supplies: number;
  overall: number;
  photoAttached: boolean;
  helpfulVotes: number;
  flaggedCount: number;
  distanceFromLocation: number;
  weightApplied: number;
  createdAt: string;
}

export interface ReviewsPage {
  items: Review[];
  total: number;
  page: number;
  pageSize: number;
}

// user.ts
export type UserType = 'Unknown' | 'Traveler' | 'Trucker' | 'CityDriver' | 'Owner';
export type UserRole = 'User' | 'Moderator' | 'Admin' | 'SuperAdmin';

export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  username: string | null;
  role: UserRole;
  userType: UserType;
  trustWeight: number;
  reviewCount: number;
  isOwner: boolean;
  isActive: boolean;
  createdAt: string;
  accountAgeDays: number;
}

export interface UsersPage {
  items: User[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  username?: string;
  role?: UserRole;
  userType?: UserType;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  userType?: UserType;
  trustWeight?: number;
}
