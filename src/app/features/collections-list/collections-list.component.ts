import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WasteRequest } from '../../shared/models/wasteRequest.model';
import { selectAllWasteRequests } from '../../store/wasteRequest/waste-request.selectors';
import { User } from '../../shared/models/auth.model';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-collections-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collections-list.component.html',
  styleUrls: ['./collections-list.component.scss']
})
export class CollectionsListComponent implements OnInit {
  collectorRequests$!: Observable<WasteRequest[]>;
  currentUser: User | null;

  constructor(private store: Store, private authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    if (this.currentUser?.role === 'collecteur') {
      const userCity = this.currentUser.address.city;
      this.collectorRequests$ = this.store.select(selectAllWasteRequests).pipe(
        map((requests) =>
          requests.filter((req) => req.address.city === userCity)
        )
      );
    }
  }
}
