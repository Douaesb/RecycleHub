import { createAction, props } from '@ngrx/store';
import { User } from '../../shared/models/auth.model';

export const registerUser = createAction(
  '[Auth] Register User',
  props<{ user: User }>()
);

export const registerUserSuccess = createAction(
  '[Auth] Register User Success',
  props<{ message: string }>()
);

export const registerUserFailure = createAction(
  '[Auth] Register User Failure',
  props<{ error: string }>()
);

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: { email: string; fullName: string } }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');
