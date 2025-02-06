import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';
import { WasteRequest } from '../../shared/models/wasteRequest.model';
import { selectAllWasteRequests } from '../../store/wasteRequest/waste-request.selectors';
import { User } from '../../shared/models/auth.model';
import { CommonModule } from '@angular/common';
import { selectAuthUser } from '../../store/auth/auth.selectors';
import * as WasteRequestActions from '../../store/wasteRequest/waste-request.actions';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-waste-request-list',
  standalone: true,
  templateUrl: './waste-request-list.component.html',
  styleUrls: ['./waste-request-list.component.scss'],
  imports: [CommonModule, RouterLink],
})
export class WasteRequestListComponent implements OnInit {
  wasteRequests$!: Observable<WasteRequest[]>;
  currentUser$!: Observable<User | null>;
  userName$!: Observable<string>;
  canAddWasteRequest$!: Observable<boolean>;
  maxAllowedRequests = 3;
  showLimitMessage = false;

  
  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.store.dispatch(WasteRequestActions.loadWasteRequests());
    this.currentUser$ = this.store.select(selectAuthUser);
    this.userName$ = this.store.select(selectAuthUser).pipe(
      map((user) => (user ? user.firstName : ''))
    );
    this.wasteRequests$ = this.store.select(selectAllWasteRequests);

    this.canAddWasteRequest$ = combineLatest([
      this.currentUser$,
      this.wasteRequests$
    ]).pipe(
      map(([currentUser, requests]) => {
        if (currentUser) {
          const activeRequests = requests.filter(
            request =>
              String(request.userId) === String(currentUser.id) &&
              request.status !== 'validated' &&
              request.status !== 'rejected'
          );
          return activeRequests.length < this.maxAllowedRequests;
        }
        return false;
      })
    );
  }

  get filteredWasteRequests$(): Observable<WasteRequest[]> {
    return combineLatest([this.currentUser$, this.wasteRequests$]).pipe(
      map(([currentUser, requests]) => {
        if (currentUser) {
          return requests.filter((request) => {
            const userId = currentUser.id;
            const requestUserId = request.userId;
            return String(requestUserId) === String(userId);
          });
        }
        return [];
      })
    );
  }

  onEdit(requestId: number): void {
    this.router.navigate(['/waste-request', requestId]);
  }

  onDelete(requestId: number): void {
    this.store.dispatch(WasteRequestActions.deleteWasteRequest({ requestId }));
  }

  onAddWasteRequest(): void {
    this.canAddWasteRequest$.subscribe(canAdd => {
      if (!canAdd) {
        this.showLimitMessage = true;
      } else {
        this.router.navigate(['/waste-request']);
      }
    });
  }
}
