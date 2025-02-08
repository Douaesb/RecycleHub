import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { WasteRequest } from '../../shared/models/wasteRequest.model';
import { selectValidatedWasteRequests } from '../../store/wasteRequest/waste-request.selectors';
import { calculatePoints } from '../../store/wasteRequest/waste-request.actions';
import { CommonModule } from '@angular/common';
import { User } from '../../shared/models/auth.model';
import { selectUserPoints } from '../../store/userPoints/user-points.selectors';
import { take } from 'rxjs/operators';
import { redeemPoints } from '../../store/userPoints/user-points.actions';

@Component({
  selector: 'app-points-system',
  standalone: true,
  templateUrl: './points-system.component.html',
  styleUrls: ['./points-system.component.scss'],
  imports: [CommonModule],
})
export class PointsSystemComponent {
  points$: Observable<number>;
  validatedRequests$: Observable<WasteRequest[]>;
  currentUser: User | null;

  constructor(private store: Store) {
    this.currentUser = this.getCurrentUser();
    const userId = this.currentUser?.id || '';
    this.validatedRequests$ = this.store.select(selectValidatedWasteRequests(userId));
    this.points$ = this.store.select(selectUserPoints(userId));
  }

  ngOnInit(): void {
    this.points$.pipe(take(1)).subscribe(points => console.log('Current User Points:', points));
    this.validatedRequests$.pipe(take(1)).subscribe((requests) => {
      if (requests.length > 0) {
        this.store.dispatch(calculatePoints({ requests }));
      }
    });
  }

  redeemVoucher(): void {
    this.points$.pipe(take(1)).subscribe((points) => {
      let redeemablePoints = 0;
      let reward = '';

      if (points >= 500) {
        redeemablePoints = 500;
        reward = '350 Dh';
      } else if (points >= 200) {
        redeemablePoints = 200;
        reward = '120 Dh';
      } else if (points >= 100) {
        redeemablePoints = 100;
        reward = '50 Dh';
      } else {
        alert('Not enough points to redeem a voucher.');
        return;
      }

      if (confirm(`Do you want to redeem ${redeemablePoints} points for a ${reward} voucher?`)) {
        this.store.dispatch(redeemPoints({ userId: this.currentUser?.id || '', points: redeemablePoints }));
      }
    });
  }

  private getCurrentUser(): User | null {
    const userString = sessionStorage.getItem('recyclehub_current_user');
    return userString ? JSON.parse(userString) : null;
  }

 
}
