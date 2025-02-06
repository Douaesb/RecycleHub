import { createAction, props } from '@ngrx/store';
import { WasteRequest } from '../../shared/models/wasteRequest.model';

// Add waste request
export const addWasteRequest = createAction(
  '[Waste Request] Add Waste Request',
  props<{ request: WasteRequest }>()
);

export const addWasteRequestSuccess = createAction(
  '[Waste Request] Add Waste Request Success',
  props<{ request: WasteRequest }>()
);

export const addWasteRequestFailure = createAction(
  '[Waste Request] Add Waste Request Failure',
  props<{ error: any }>()
);

// Update waste request
export const updateWasteRequest = createAction(
  '[Waste Request] Update Waste Request',
  props<{ request: WasteRequest }>()
);

export const updateWasteRequestSuccess = createAction(
  '[Waste Request] Update Waste Request Success',
  props<{ request: WasteRequest }>()
);

export const updateWasteRequestFailure = createAction(
  '[Waste Request] Update Waste Request Failure',
  props<{ error: any }>()
);

// Delete waste request
export const deleteWasteRequest = createAction(
  '[Waste Request] Delete Waste Request',
  props<{ requestId: number }>()
);

export const deleteWasteRequestSuccess = createAction(
  '[Waste Request] Delete Waste Request Success',
  props<{ requestId: number }>()
);

export const deleteWasteRequestFailure = createAction(
  '[Waste Request] Delete Waste Request Failure',
  props<{ error: any }>()
);

// Load waste requests
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
