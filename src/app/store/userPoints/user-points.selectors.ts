import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PointsState } from '../../shared/models/points.model';

export const selectPointsState = createFeatureSelector<PointsState>('userPoints');

export const selectUserPoints = (userId: string) =>
  createSelector(selectPointsState, (state) => state.userPoints[userId] || 0);
