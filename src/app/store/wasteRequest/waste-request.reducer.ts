import { createReducer, on } from '@ngrx/store';
import { WasteRequest } from '../../shared/models/wasteRequest.model';
import * as WasteRequestActions from './waste-request.actions';

export interface State {
  wasteRequests: WasteRequest[];
  loading: boolean; 
  error: any;
  points: number;
  success: boolean;
}

export const initialState: State = {
  wasteRequests: [],
  loading: false,
  error: null,
  points: 0,
  success: false,
};

export const wasteRequestReducer = createReducer(
  initialState,
  on(WasteRequestActions.loadWasteRequestsSuccess, (state, { requests }) => ({
    ...state,
    wasteRequests: requests,
    loading: false,
  })),  
  on(WasteRequestActions.loadWasteRequestsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false, 
  })),
  on(WasteRequestActions.loadWasteRequests, (state) => ({
    ...state,
    loading: true, 
  })),
  on(WasteRequestActions.addWasteRequestSuccess, (state, { request }) => ({
    ...state,
    wasteRequests: [...state.wasteRequests, request],
    loading: false,
  })),
  on(WasteRequestActions.addWasteRequestFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false, 
  })),
  on(WasteRequestActions.updateWasteRequest, (state, { request }) => ({
    ...state,
    wasteRequests: state.wasteRequests.map(r =>
      r.id === request.id ? { ...r, ...request } : r
    ),
    loading: false, 
  })),
  on(WasteRequestActions.updateWasteRequestFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false, 
  })),
  on(WasteRequestActions.deleteWasteRequest, (state, { requestId }) => ({
    ...state,
    wasteRequests: state.wasteRequests.filter(r => r.id !== requestId),
    loading: false, 
  })),
  on(WasteRequestActions.deleteWasteRequestFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false, 
  })),
    on(WasteRequestActions.updateWasteRequestStatusSuccess, (state, { updatedRequest }) => ({
      ...state,
      wasteRequests: state.wasteRequests.map((req) =>
        req.id === updatedRequest.id ? updatedRequest : req
      ),
    })),
    on(WasteRequestActions.calculatePoints, (state, { requests }) => {
      const totalPoints = requests.reduce((sum, request) => {
        const pointRates = { plastic: 2, glass: 1, paper: 1, metal: 5 };
        return (
          sum +
          Object.entries(request.wasteWeights).reduce((pointsSum, [type, weight]) => {
            const pointsForType = (pointRates[type as keyof typeof pointRates] || 0) * (weight / 1000);
            return pointsSum + pointsForType;
          }, 0)
        );
      }, 0);
      return { ...state, points: totalPoints };
    }),    
  
  );
