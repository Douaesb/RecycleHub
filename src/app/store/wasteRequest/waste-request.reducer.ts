import { createReducer, on } from '@ngrx/store';
import { WasteRequest } from '../../shared/models/wasteRequest.model';
import * as WasteRequestActions from './waste-request.actions';

export interface State {
  wasteRequests: WasteRequest[];
  error: any;
}

export const initialState: State = {
  wasteRequests: [],
  error: null,
};

export const wasteRequestReducer = createReducer(
  initialState,
  on(WasteRequestActions.loadWasteRequestsSuccess, (state, { requests }) => ({
    ...state,
    wasteRequests: requests,
  })),
  on(WasteRequestActions.loadWasteRequestsFailure, (state, { error }) => ({
    ...state,
    error: error,
  })),
  on(WasteRequestActions.addWasteRequest, (state, { request }) => ({
    ...state,
    wasteRequests: [...state.wasteRequests, request],
  })),
  on(WasteRequestActions.updateWasteRequest, (state, { request }) => ({
    ...state,
    wasteRequests: state.wasteRequests.map(r =>
      r.id === request.id ? { ...r, ...request } : r
    ),
  })),
  on(WasteRequestActions.deleteWasteRequest, (state, { requestId }) => ({
    ...state,
    wasteRequests: state.wasteRequests.filter(r => r.id !== requestId),
  }))
);
