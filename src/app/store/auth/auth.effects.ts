import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../core/services/auth.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authService: AuthService) {}

  registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerUser),
      switchMap(action =>
        this.authService.register(action.user).pipe(
          map(response => AuthActions.registerUserSuccess({ message: response.message })),
          catchError(error => of(AuthActions.registerUserFailure({ error: error.message })))
        )
      )
    )
    );

    login$ = createEffect(() =>
        this.actions$.pipe(
          ofType(AuthActions.login),
          switchMap(({ email, password }) =>
            this.authService.authenticate(email, password).pipe(
              map((user) => AuthActions.loginSuccess({ user })),
              catchError((error) =>
                of(AuthActions.loginFailure({ error: error.message }))
              )
            )
          )
        )
      );

}
