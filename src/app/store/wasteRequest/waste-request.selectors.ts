import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WasteRequest } from '../../shared/models/wasteRequest.model';
import { State } from './waste-request.reducer';

const getWasteRequestState = createFeatureSelector<State>('wasteRequests');

export const selectAllWasteRequests = createSelector(
  getWasteRequestState,
  (state: State) => state.wasteRequests
);

export const selectWasteRequestLoading = createSelector(
  getWasteRequestState,
  (state: State) => state.loading
);

export const selectWasteRequestError = createSelector(
  getWasteRequestState,
  (state: State) => state.error
);

export const selectWasteRequestById = (id: number) => createSelector(
  getWasteRequestState,
  (state: State) => state.wasteRequests.find((request: WasteRequest) => request.id === id)
);

export const selectWasteRequestsByUserId = (userId: number) =>
  createSelector(selectAllWasteRequests, (wasteRequests: WasteRequest[]) =>
    wasteRequests.filter((request) => request.userId === userId && request.status !== 'validated' && request.status !== 'rejected')
  );

  export const selectValidatedWasteRequests = (userId: string) =>
    createSelector(selectAllWasteRequests, (wasteRequests: WasteRequest[]) =>
      wasteRequests.filter((request) => String(request.userId) === userId && request.status === 'validated')
    );
  