import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { WasteRequestService } from '../../core/services/demande.service';
import * as WasteRequestActions from './waste-request.actions';

@Injectable()
export class WasteRequestEffects {

  constructor(
    private actions$: Actions,
    private wasteRequestService: WasteRequestService,
    private store: Store
  ) {}

  // Effet pour charger les demandes de collecte
  loadWasteRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WasteRequestActions.loadWasteRequests),
      switchMap(() => {
        const requests = this.wasteRequestService.getWasteRequests(); // Récupère les données depuis localStorage
        return of(WasteRequestActions.loadWasteRequestsSuccess({ requests }));
      }),
      catchError(error =>
        of(WasteRequestActions.loadWasteRequestsFailure({ error }))
      )
    )
  );
}
