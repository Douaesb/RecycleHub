import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { selectIsAuthenticated, selectIsCollector } from '../../store/auth/auth.selectors';

export const authGuard = () => {
  const router = inject(Router);
  const store = inject(Store);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }
      return router.createUrlTree(['/login']);
    })
  );
};

export const publicOnlyGuard = () => {
  const router = inject(Router);
  const store = inject(Store);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        return true;
      }
      return router.createUrlTree(['/dashboard']);
    })
  );
};

export const collectorGuard = () => {
  const router = inject(Router);
  const store = inject(Store);

  return store.select(selectIsCollector).pipe(
    take(1),
    map(isCollector => {
      if (isCollector) {
        return true;
      }
      return router.createUrlTree(['/dashboard']);
    })
  );
};