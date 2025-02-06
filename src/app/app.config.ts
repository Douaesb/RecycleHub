import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { MetaReducer, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { wasteRequestReducer } from './store/wasteRequest/waste-request.reducer';
import { WasteRequestEffects } from './store/wasteRequest/waste-request.effects';
import { localStorageSync } from 'ngrx-store-localstorage';


export function localStorageSyncReducer(reducer: any): any {
  return localStorageSync({
    keys: ["auth"],
    rehydrate: true,
  })(reducer)
}

const metaReducers: MetaReducer[] = [localStorageSyncReducer]

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({ auth: authReducer, wasteRequests: wasteRequestReducer },  { metaReducers },),
    provideEffects([AuthEffects, WasteRequestEffects]),
  ],
};
