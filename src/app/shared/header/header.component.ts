import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { logout } from '../../store/auth/auth.actions';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { AuthState } from '../../store/auth/auth.state';
import { selectIsCollector } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  showHeader: boolean = true;
  private subscription!: Subscription;
  isCollector$: Observable<boolean>;

  constructor(
    private store: Store<{ auth: { user: any } }>,
    private router: Router,
    private readonly storeAuth: Store<{ auth: AuthState }>,
  ) {
    this.isCollector$ = this.storeAuth.select(selectIsCollector);
  }

  ngOnInit() {

    this.subscription = this.store.select('auth').subscribe((authState) => {
      this.isLoggedIn = !!authState.user;
    });

    this.router.events.subscribe(() => {
      const hideHeaderRoutes = ['/login', '/register'];
      this.showHeader = !hideHeaderRoutes.includes(this.router.url);
    });
  }

  onLogout() {
    this.store.dispatch(logout());
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
