import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'waste-request/:id',
    loadComponent: () => import('./features/waste-request/waste-request.component').then((m) => m.WasteRequestComponent),
    canActivate: [authGuard],
  },
  {
    path: 'waste-request',
    loadComponent: () => import('./features/waste-request/waste-request.component').then((m) => m.WasteRequestComponent),
    canActivate: [authGuard],
  },
  {
    path: 'waste-request-list',
    loadComponent: () => import('./features/waste-request-list/waste-request-list.component').then((m) => m.WasteRequestListComponent),
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/user-settings/user-settings.component').then((m) => m.UserSettingsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'collections-list',
    loadComponent: () => import('./features/collections-list/collections-list.component').then((m) => m.CollectionsListComponent),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
