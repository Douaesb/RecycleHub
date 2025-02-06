import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { WasteRequest } from '../../shared/models/wasteRequest.model';
import { selectAllWasteRequests, selectWasteRequestError, selectWasteRequestLoading } from '../../store/wasteRequest/waste-request.selectors';
import { updateWasteRequest, addWasteRequest, deleteWasteRequest } from '../../store/wasteRequest/waste-request.actions';
import { User } from '../../shared/models/auth.model';

@Component({
  selector: 'app-waste-request',
  standalone: true,
  templateUrl: './waste-request.component.html',
  styleUrls: ['./waste-request.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class WasteRequestComponent {
  wasteRequestForm: FormGroup;
  wasteRequests$: Observable<WasteRequest[]>;
  error$: Observable<any>;
  loading$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {
    const currentUser = this.getCurrentUser();

    this.wasteRequestForm = this.fb.group({
      id: [null],
      wasteType: ['', Validators.required],
      estimatedWeight: [null, [Validators.required, Validators.min(1000)]],
      collectionAddress: ['', Validators.required],
      preferredDateTime: ['', Validators.required],
      additionalNotes: [''],
      status: ['pending'],
      userId: [currentUser ? currentUser.id : null], 
    });

    this.wasteRequests$ = this.store.select(selectAllWasteRequests);
    this.error$ = this.store.select(selectWasteRequestError);
    this.loading$ = this.store.select(selectWasteRequestLoading);
  }

  onSubmit(): void {
    if (this.wasteRequestForm.valid) {
      const wasteRequest: Partial<WasteRequest> = this.wasteRequestForm.value;
      if (wasteRequest.id) {
        this.store.dispatch(updateWasteRequest({ request: wasteRequest as WasteRequest }));
        this.router.navigate(['/waste-request-list']);
      } else {
        const { id, ...newRequest } = wasteRequest;
        this.store.dispatch(addWasteRequest({ request: newRequest as WasteRequest }));
        this.router.navigate(['/waste-request-list']);
      }
    }
  }

  onDelete(requestId: number): void {
    this.store.dispatch(deleteWasteRequest({ requestId }));
  }

  onEdit(request: WasteRequest): void {
    this.wasteRequestForm.patchValue(request);
  }

  onReset(): void {
    this.wasteRequestForm.reset();
  }

  private getCurrentUser(): User | null {
    const userString = sessionStorage.getItem('recyclehub_current_user');
    return userString ? JSON.parse(userString) : null;
  }
}
