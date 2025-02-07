import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthUser = createSelector(
  selectAuthState,
  (state) => state.user
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

export const selectIsAuthenticated = createSelector(
  selectAuthUser,
  (user) => !!user
);

export const selectIsCollector = createSelector(
  selectAuthUser,
  (user) => user?.role === 'collecteur'
);

export const selectIsParticulier = createSelector(
  selectAuthUser,
  (user) => user?.role === 'particulier'
);