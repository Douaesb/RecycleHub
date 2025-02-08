import { createAction, props } from '@ngrx/store';

export const addPoints = createAction(
  '[Points] Add Points',
  props<{ userId: string; points: number }>()
);

export const resetPoints = createAction(
  '[Points] Reset Points',
  props<{ userId: string }>()
);

export const redeemPoints = createAction(
    '[Points] Redeem Points',
    props<{ userId: string; points: number }>()
  );