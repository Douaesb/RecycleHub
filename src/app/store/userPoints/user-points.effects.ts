import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { WasteRequestService } from '../../core/services/demande.service';
import { addPoints, redeemPoints, resetPoints } from './user-points.actions';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
;

@Injectable()
export class PointsEffects {

  constructor(
    private actions$: Actions,
    private wasteRequestService: WasteRequestService,
    private store: Store
  ) {}

  initPoints$ = createEffect(
    () =>
      of(null).pipe(
        tap(() => {
          const storedPoints = JSON.parse(localStorage.getItem('userPoints') || '{}');
          Object.keys(storedPoints).forEach(userId => {
            const points = storedPoints[userId];
            this.store.dispatch(addPoints({ userId, points }));
          });
        })
      ),
    { dispatch: false }
  );
  
  addPoints$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addPoints),
      tap(({ userId, points }) => {
        this.wasteRequestService.addUserPoints(userId, points);
      })
    ),
    { dispatch: false }
  );

  resetPoints$ = createEffect(() =>
    this.actions$.pipe(
      ofType(resetPoints),
      tap(({ userId }) => {
        this.wasteRequestService.resetUserPoints(userId);
      })
    ),
    { dispatch: false }
  );
  redeemPoints$ = createEffect(() =>
    this.actions$.pipe(
      ofType(redeemPoints),
      tap(({ userId, points }) => {
        this.wasteRequestService.reduceUserPoints(userId, points);
      })
    ),
    { dispatch: false }
  );
}
