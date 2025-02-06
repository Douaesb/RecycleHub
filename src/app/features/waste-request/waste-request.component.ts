import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { WasteRequest, WasteType } from '../../shared/models/wasteRequest.model';
import { selectAllWasteRequests, selectWasteRequestById, selectWasteRequestError, selectWasteRequestLoading } from '../../store/wasteRequest/waste-request.selectors';
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
  error$: Observable<any>;
  loading$: Observable<boolean>;
  isEditMode: boolean = false;
  wasteTypes: WasteType[] = ['plastic', 'glass', 'paper', 'metal'];

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const currentUser = this.getCurrentUser();

    this.wasteRequestForm = this.fb.group({
      id: [null],
      wasteTypes: [[], [Validators.required, this.atLeastOneCheckboxSelectedValidator]],
      estimatedWeight: [null, [Validators.required, Validators.min(1000), Validators.max(10000)]],
      address: this.fb.group({
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      }),
      preferredDateTime: ['', [Validators.required, this.preferredTimeSlotValidator, this.futureDateValidator]],
      additionalNotes: [''],
      status: ['pending'],
      userId: [currentUser ? currentUser.id : null],
    });

    const requestId = this.route.snapshot.paramMap.get('id');
    if (requestId) {
      this.isEditMode = true;
      this.store.select(selectWasteRequestById(Number(requestId))).subscribe((request) => {
        if (request) this.wasteRequestForm.patchValue(request);
      });
    }

    this.error$ = this.store.select(selectWasteRequestError);
    this.loading$ = this.store.select(selectWasteRequestLoading);
  }

  get wasteType(): FormArray {
    return this.wasteRequestForm.get('wasteType') as FormArray;
  }

  onSubmit(): void {
    if (this.wasteRequestForm.valid) {
      const wasteRequest: Partial<WasteRequest> = this.wasteRequestForm.value;
      if (this.isEditMode) {
        this.store.dispatch(updateWasteRequest({ request: wasteRequest as WasteRequest }));
      } else {
        this.store.dispatch(addWasteRequest({ request: wasteRequest as WasteRequest }));
      }
      this.router.navigate(['/waste-request-list']);
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

  onWasteTypeChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const currentTypes = this.wasteRequestForm.get('wasteTypes')?.value as WasteType[];
    
    if (checkbox.checked) {
      currentTypes.push(checkbox.value as WasteType);
    } else {
      const index = currentTypes.indexOf(checkbox.value as WasteType);
      if (index > -1) {
        currentTypes.splice(index, 1);
      }
    }
    
    this.wasteRequestForm.patchValue({ wasteTypes: currentTypes });
  }
  
  private preferredTimeSlotValidator(control: any): { [key: string]: any } | null {
    if (!control.value) return null;

    const selectedTime = new Date(control.value).getHours();
    return selectedTime >= 9 && selectedTime <= 17 ? null : { invalidTimeSlot: true };
  }

  private futureDateValidator(control: any): { [key: string]: any } | null {
    if (!control.value) return null;

    const today = new Date();
    const selectedDate = new Date(control.value);

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate >= today ? null : { pastDate: true };
  }
  private atLeastOneCheckboxSelectedValidator(control: any) {
    return control.value && control.value.length > 0
      ? null
      : { required: true };
  }
}
