import { createAction, props } from '@ngrx/store';
import { WasteRequest } from '../../shared/models/wasteRequest.model';

// Actions pour gérer les demandes de collecte
export const addWasteRequest = createAction(
  '[Waste Request] Add Waste Request',
  props<{ request: WasteRequest }>()
);

export const updateWasteRequest = createAction(
  '[Waste Request] Update Waste Request',
  props<{ request: WasteRequest }>()
);

export const deleteWasteRequest = createAction(
  '[Waste Request] Delete Waste Request',
  props<{ requestId: number }>()
);

export const loadWasteRequests = createAction(
  '[Waste Request] Load Waste Requests'
);

export const loadWasteRequestsSuccess = createAction(
  '[Waste Request] Load Waste Requests Success',
  props<{ requests: WasteRequest[] }>()
);

export const loadWasteRequestsFailure = createAction(
  '[Waste Request] Load Waste Requests Failure',
  props<{ error: any }>()
);
