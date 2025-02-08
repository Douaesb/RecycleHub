import { createReducer, on } from '@ngrx/store';
import { PointsState } from '../../shared/models/points.model';
import { addPoints, redeemPoints, resetPoints } from './user-points.actions';

export const initialState: PointsState = {
  userPoints: {}
};

export const pointsReducer = createReducer(
  initialState,
  on(addPoints, (state, { userId, points }) => ({
    ...state,
    userPoints: {
      ...state.userPoints,
      [userId]: (state.userPoints[userId] || 0) + points
    }
  })),
  on(resetPoints, (state, { userId }) => ({
    ...state,
    userPoints: {
      ...state.userPoints,
      [userId]: 0
    }
  })),
  on(redeemPoints, (state, { userId, points }) => ({
    ...state,
    userPoints: {
      ...state.userPoints,
      [userId]: Math.max((state.userPoints[userId] || 0) - points, 0)
    }
  }))
);
