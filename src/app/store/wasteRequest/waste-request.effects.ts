import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as WasteRequestActions from './waste-request.actions';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { WasteRequestService } from '../../core/services/demande.service';
import { Router } from '@angular/router';

@Injectable()
export class WasteRequestEffects {
  constructor(
    private actions$: Actions,
    private wasteRequestService: WasteRequestService,
    private store: Store,
    private router: Router
  ) {}

  loadWasteRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WasteRequestActions.loadWasteRequests),
      mergeMap(() => {
        const requests = this.wasteRequestService.getWasteRequests();
        return of(WasteRequestActions.loadWasteRequestsSuccess({ requests }));
      })
    )
  );
  

  addWasteRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WasteRequestActions.addWasteRequest),
      mergeMap(action => {
        this.wasteRequestService.addWasteRequest(action.request);
        return of(WasteRequestActions.addWasteRequestSuccess({ request: action.request }));
      })
    )
  );

  addWasteRequestSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WasteRequestActions.addWasteRequestSuccess),
      tap(() => this.router.navigate(['/waste-request-list']))
    ),
    { dispatch: false }
  );
  

  updateWasteRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WasteRequestActions.updateWasteRequest),
      mergeMap(action => {
        this.wasteRequestService.updateWasteRequest(action.request);
        return of(WasteRequestActions.loadWasteRequests()); 
      })
    )
  );

  deleteWasteRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WasteRequestActions.deleteWasteRequest),
      mergeMap(action => {
        this.wasteRequestService.deleteWasteRequest(action.requestId);
        return of(WasteRequestActions.loadWasteRequests()); 
      })
    )
  );

  updateWasteRequestStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WasteRequestActions.updateWasteRequestStatus),
      mergeMap(({ id, status }) =>
        this.wasteRequestService.updateWasteRequestStatus(id, status).pipe(
          map((updatedRequest) => {
            if (updatedRequest === null) {
              throw new Error('Updated request is null');
            }
            return WasteRequestActions.updateWasteRequestStatusSuccess({
              updatedRequest,
            });
          }),
          catchError((error) =>
            of(WasteRequestActions.updateWasteRequestStatusFailure({ error }))
          )
        )
      )
    )
  );
}
