import client from './client';
import type { AuthResponse, LoginRequest } from '@/types/auth';
import type { LocationDetail, LocationSummary, CreateLocationRequest } from '@/types/location';
import type { ReviewsPage } from '@/types/review';
import type { User, UsersPage, CreateUserRequest, UpdateUserRequest } from '@/types/review';

// ── Auth ─────────────────────────────────────────────────────────────────────

/** Authenticates an admin user with email and password. */
export const login = (data: LoginRequest) =>
  client.post<AuthResponse>('/api/v1/auth/login', data).then((r) => r.data);

/** Revokes the current refresh token. */
export const logout = (refreshToken: string) =>
  client.post('/api/v1/auth/logout', { refreshToken });

/** Exchanges a refresh token for a new access token. */
export const refresh = (refreshToken: string) =>
  client.post<AuthResponse>('/api/v1/auth/refresh', { refreshToken }).then((r) => r.data);

// ── Locations ─────────────────────────────────────────────────────────────────

/** Returns all locations for the admin list view. */
export const getLocations = (page = 1, pageSize = 20, search = '') =>
  client
    .get<{ items: LocationSummary[]; total: number }>('/api/v1/admin/locations', {
      params: { page, pageSize, search },
    })
    .then((r) => r.data);

/** Returns full detail for a single location. */
export const getLocation = (id: string) =>
  client.get<LocationDetail>(`/api/v1/admin/locations/${id}`).then((r) => r.data);

/** Creates a new location. */
export const createLocation = (data: CreateLocationRequest) =>
  client.post<LocationDetail>('/api/v1/admin/locations', data).then((r) => r.data);

/** Updates an existing location. */
export const updateLocation = (id: string, data: Partial<CreateLocationRequest>) =>
  client.patch<LocationDetail>(`/api/v1/admin/locations/${id}`, data).then((r) => r.data);

/** Soft-deletes a location by marking it inactive. */
export const deactivateLocation = (id: string) =>
  client.delete(`/api/v1/admin/locations/${id}`);

// ── Reviews ───────────────────────────────────────────────────────────────────

/** Returns paginated reviews with optional filters. */
export const getReviews = (params: {
  page?: number;
  pageSize?: number;
  flaggedOnly?: boolean;
  locationId?: string;
}) => client.get<ReviewsPage>('/api/v1/admin/reviews', { params }).then((r) => r.data);

/** Permanently removes a review. */
export const deleteReview = (id: string) =>
  client.delete(`/api/v1/admin/reviews/${id}`);

/** Approves a flagged review, resetting its flag count. */
export const approveReview = (id: string) =>
  client.post(`/api/v1/admin/reviews/${id}/approve`);

// ── Users ─────────────────────────────────────────────────────────────────────

/** Returns paginated users with optional search. */
export const getUsers = (params: { page?: number; pageSize?: number; search?: string }) =>
  client.get<UsersPage>('/api/v1/users', { params }).then((r) => r.data);

/** Returns full detail for a single user. */
export const getUser = (id: string) =>
  client.get<User>(`/api/v1/users/${id}`).then((r) => r.data);

/** Creates a new user account. */
export const createUser = (data: CreateUserRequest) =>
  client.post<User>('/api/v1/users', data).then((r) => r.data);

/** Updates a user's profile fields. Only provided fields are applied. */
export const updateUser = (id: string, data: UpdateUserRequest) =>
  client.patch<User>(`/api/v1/users/${id}`, data).then((r) => r.data);

/** Permanently deletes a user account. */
export const deleteUser = (id: string) =>
  client.delete(`/api/v1/users/${id}`);

/** Deactivates a user account and revokes all active sessions. */
export const deactivateUser = (id: string) =>
  client.post(`/api/v1/users/${id}/deactivate`);

/** Reactivates a previously deactivated user account. */
export const reactivateUser = (id: string) =>
  client.post(`/api/v1/users/${id}/reactivate`);

/** Revokes all active sessions without deactivating the account. */
export const revokeUserSessions = (id: string) =>
  client.post(`/api/v1/users/${id}/revoke-sessions`);

/** Resets a user's password. */
export const resetUserPassword = (id: string, newPassword: string) =>
  client.post(`/api/v1/users/${id}/reset-password`, { newPassword });

/** Returns paginated review history for a user. */
export const getUserReviews = (id: string, params: { page?: number; pageSize?: number }) =>
  client.get<ReviewsPage>(`/api/v1/users/${id}/reviews`, { params }).then((r) => r.data);
