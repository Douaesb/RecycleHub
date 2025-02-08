import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import {
  WasteRequest,
  WasteType,
} from '../../shared/models/wasteRequest.model';
import {
  selectAllWasteRequests,
  selectWasteRequestById,
  selectWasteRequestError,
  selectWasteRequestLoading,
} from '../../store/wasteRequest/waste-request.selectors';
import {
  updateWasteRequest,
  addWasteRequest,
  deleteWasteRequest,
} from '../../store/wasteRequest/waste-request.actions';
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
  currentUser: User | null;
  pendingRequests$: Observable<WasteRequest[]>;
  maxTotalWeight = 10000;
  wasteWeights: Record<WasteType, number> = {
    plastic: 0,
    glass: 0,
    paper: 0,
    metal: 0
  };
  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.currentUser = this.getCurrentUser();

    this.wasteRequestForm = this.fb.group({
      id: [null],
      wasteTypes: [[], [Validators.required]],
      wasteWeights: this.fb.group({
        plastic: [0, [Validators.min(0)]],
        glass: [0, [Validators.min(0)]],
        paper: [0, [Validators.min(0)]],
        metal: [0, [Validators.min(0)]]
      }),
      estimatedWeight: [0, [Validators.required, Validators.min(1000)]], 
      address: this.fb.group({
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      }),
      preferredDateTime: [
        '',
        [
          Validators.required,
          this.preferredTimeSlotValidator,
          this.futureDateValidator,
        ],
      ],
      additionalNotes: [''],
      status: ['pending'],
      userId: [this.currentUser ? this.currentUser.id : null],
    });

    const requestId = this.route.snapshot.paramMap.get('id');
if (requestId) {
  this.isEditMode = true;
  this.store
    .select(selectWasteRequestById(Number(requestId)))
    .subscribe((request) => {
      if (request) {
        this.wasteRequestForm.patchValue(request);
        const weightsGroup = this.wasteRequestForm.get('wasteWeights') as FormGroup;
        request.wasteTypes.forEach((type: WasteType) => {
          if (!weightsGroup.get(type)) {
            weightsGroup.addControl(type, this.fb.control(request.wasteWeights[type], [Validators.min(0)]));
          }
        });
      }
    });
}

  
    this.error$ = this.store.select(selectWasteRequestError);
    this.loading$ = this.store.select(selectWasteRequestLoading);
    this.pendingRequests$ = this.store.select(selectAllWasteRequests);
    this.addMaxWeightValidation();

  }

  ngOnInit() {
  
    const weightsGroup = this.wasteRequestForm.get("wasteWeights") as FormGroup
    Object.keys(weightsGroup.controls).forEach((key) => {
      weightsGroup.get(key)?.valueChanges.subscribe(() => {
        this.updateTotalWeight()
      })
    })
  }

 updateTotalWeight(): void {
    const weightsGroup = this.wasteRequestForm.get("wasteWeights") as FormGroup
    const total = Object.values(weightsGroup.value).reduce((sum: number, weight) => sum + (Number(weight) || 0), 0)

    this.wasteRequestForm.get("estimatedWeight")?.setValue(total)
    this.wasteRequestForm.get("estimatedWeight")?.updateValueAndValidity()
  }

  addMaxWeightValidation(): void {
    this.pendingRequests$.subscribe((requests) => {
      const currentRequestId = this.wasteRequestForm.get('id')?.value;
      const pendingRequests = requests.filter(
        (req) =>
          String(req.userId) === String(this.currentUser?.id) &&
          req.status === 'pending'
      );
      let currentTotalWeight = pendingRequests.reduce(
        (sum, req) => sum + req.estimatedWeight,
        0
      );
  
      if (this.isEditMode && currentRequestId) {
        const currentRequest = pendingRequests.find(
          (req) => req.id === currentRequestId
        );
        if (currentRequest) {
          currentTotalWeight -= currentRequest.estimatedWeight;
        }
      }
  
      this.wasteRequestForm
        .get('estimatedWeight')
        ?.setValidators([
          Validators.required,
          Validators.min(1000),
          Validators.max(10000),
          this.maxWeightValidator(currentTotalWeight),
        ]);
  
      this.wasteRequestForm.get('estimatedWeight')?.updateValueAndValidity();
    });
  }
  
  maxWeightValidator(currentTotalWeight: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
  
      const newTotalWeight = currentTotalWeight + control.value;
      return newTotalWeight > this.maxTotalWeight
        ? { maxWeightExceeded: true }
        : null;
    };
  }
  
  get wasteType(): FormArray {
    return this.wasteRequestForm.get('wasteType') as FormArray;
  }

  onSubmit(): void {
    if (this.wasteRequestForm.valid) {
      const formValue = this.wasteRequestForm.value;
      const wasteRequest: Partial<WasteRequest> = {
        ...formValue,
        estimatedWeight: Object.values(formValue.wasteWeights).reduce((sum: number, weight) => sum + (Number(weight) || 0), 0)
      };
  
      if (this.isEditMode) {
        this.store.dispatch(
          updateWasteRequest({ request: wasteRequest as WasteRequest })
        );
      } else {
        this.store.dispatch(
          addWasteRequest({ request: wasteRequest as WasteRequest })
        );
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
    const currentTypes = this.wasteRequestForm.get('wasteTypes')?.value || [];
    const weightsGroup = this.wasteRequestForm.get('wasteWeights') as FormGroup;
    let updatedTypes: WasteType[] = [...currentTypes]; 
  
    if (checkbox.checked) {
      updatedTypes.push(checkbox.value as WasteType);
      if (!weightsGroup.get(checkbox.value)) {
        weightsGroup.addControl(checkbox.value, this.fb.control(0, [Validators.min(0)]));
      }
    } else {
      updatedTypes = updatedTypes.filter(type => type !== checkbox.value);
      weightsGroup.get(checkbox.value)?.setValue(0);
    }
  
    this.wasteRequestForm.patchValue({ wasteTypes: updatedTypes });
  }

  private preferredTimeSlotValidator(
    control: any
  ): { [key: string]: any } | null {
    if (!control.value) return null;  

    const selectedTime = new Date(control.value).getHours();
    return selectedTime >= 9 && selectedTime <= 17
      ? null
      : { invalidTimeSlot: true };
  }

  private futureDateValidator(control: any): { [key: string]: any } | null {
    if (!control.value) return null;

    const today = new Date();
    const selectedDate = new Date(control.value);

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate >= today ? null : { pastDate: true };
  }
}
