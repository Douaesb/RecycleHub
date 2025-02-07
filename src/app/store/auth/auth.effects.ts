import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../core/services/auth.service';
import * as AuthActions from './auth.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap((action) =>
        this.authService.login(action.email, action.password).pipe(
          map((user) => AuthActions.loginSuccess({ user })),
          catchError((error) => of(AuthActions.loginFailure({ error: error.message })))
        )
      )
    )
  );

loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        map(({ user }) => {
          const targetRoute = user.role === 'particulier' 
            ? '/waste-request-list' 
            : '/collections-list';
          this.router.navigate([targetRoute]);
        })
      ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap((action) =>
        this.authService.register(action.user).pipe(
          map((user) => AuthActions.registerSuccess({ user })),
          tap((user) => {
            const targetRoute = user.user.role === 'particulier' 
              ? '/waste-request-list' 
              : '/collections-list';
            this.router.navigate([targetRoute]);
          }),
          catchError((error) =>
            of(AuthActions.registerFailure({ error: error.message }))
          )
        )
      )
    )
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        map(() => {
          this.authService.logout();
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateUser),
      mergeMap(({ user }) =>
        of(user).pipe(
          tap(updatedUser => {
            this.authService.updateUser(updatedUser);
          }),
          map(() => ({
            type: '[Auth API] Update User Success',
          })),
          catchError(() => of({ type: '[Auth API] Update User Failure' }))
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.deleteUser),
      mergeMap(({ userId }) =>
        of(userId).pipe(
          tap(() => {
            this.authService.deleteUser(userId);
          }),
          map(() => ({
            type: '[Auth API] Delete User Success',
          })),
          tap(() => {
            this.router.navigate(['/login']);
          }),
          catchError(() => of({ type: '[Auth API] Delete User Failure' }))
        )
      )
    )
  );

}
