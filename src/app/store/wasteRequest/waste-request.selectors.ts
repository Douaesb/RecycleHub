import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './waste-request.reducer';

// Sélecteur principal pour accéder à l'état WasteRequest
const getWasteRequestState = createFeatureSelector<State>('wasteRequest');

// Sélecteurs pour obtenir les demandes de collecte
export const selectAllWasteRequests = createSelector(
  getWasteRequestState,
  (state: State) => state.wasteRequests
);

export const selectWasteRequestsError = createSelector(
  getWasteRequestState,
  (state: State) => state.error
);

export const selectWasteRequestById = (id: number) =>
  createSelector(getWasteRequestState, (state: State) =>
    state.wasteRequests.find(request => request.id === id)
  );
