import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { WasteRequest } from '../../shared/models/wasteRequest.model';
import { selectAllWasteRequests} from '../../store/wasteRequest/waste-request.selectors';
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

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.store.dispatch(WasteRequestActions.loadWasteRequests()); 
    this.currentUser$ = this.store.select(selectAuthUser); 
    this.userName$ = this.store.select(selectAuthUser).pipe(
      map((user) => user ? user.firstName : '')
    );
    this.wasteRequests$ = this.store.select(selectAllWasteRequests); 
      this.store.select(selectAllWasteRequests).subscribe((requests) => {
      console.log('All Waste Requests:', requests); 
    });
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


}
