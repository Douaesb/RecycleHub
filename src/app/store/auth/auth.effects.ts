import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../core/services/auth.service';
import * as AuthActions from './auth.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  // Handle login action
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

  // Handle login success action (redirect after successful login)
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        map(() => {
          // Navigate to the /waste-request route after login success
          this.router.navigate(['/waste-request']);
        })
      ),
    { dispatch: false } // Don't dispatch any further actions here
  );

  // Handle register action
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap((action) =>
        this.authService.register(action.user).pipe(
          map((user) => AuthActions.registerSuccess({ user })),
          catchError((error) => of(AuthActions.registerFailure({ error: error.message })))
        )
      )
    )
  );

  // Handle logout action
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        map(() => {
          // Clear session storage when logging out
          this.authService.logout();
          // Navigate to the login page after logout
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false } // No further action dispatch needed
  );
}
