import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { WasteRequestService } from '../../core/services/demande.service';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as WasteRequestActions from '../../store/wasteRequest/waste-request.actions';

@Component({
  selector: 'app-waste-request',
  standalone: true,
  templateUrl: './waste-request.component.html',
  styleUrls: ['./waste-request.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class WasteRequestComponent {
  wasteRequestForm: FormGroup;
  message: string | null = null;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private wasteRequestService: WasteRequestService,
    private store: Store
  ) {
    this.wasteRequestForm = this.fb.group({
      wasteType: ['', Validators.required],
      estimatedWeight: ['', [Validators.required, Validators.min(1000)]],
      collectionAddress: ['', Validators.required],
      preferredDate: ['', Validators.required],
      preferredTimeSlot: ['', Validators.required],
      additionalNotes: [''],
      wastePhotos: [null],
    });
  }

  get wasteType() {
    return this.wasteRequestForm.controls['wasteType'];
  }

  get estimatedWeight() {
    return this.wasteRequestForm.controls['estimatedWeight'];
  }

  get collectionAddress() {
    return this.wasteRequestForm.controls['collectionAddress'];
  }

  get preferredDate() {
    return this.wasteRequestForm.controls['preferredDate'];
  }

  get preferredTimeSlot() {
    return this.wasteRequestForm.controls['preferredTimeSlot'];
  }

  get additionalNotes() {
    return this.wasteRequestForm.controls['additionalNotes'];
  }

  get wastePhotos() {
    return this.wasteRequestForm.controls['wastePhotos'];
  }

  onSubmit() {
    if (this.wasteRequestForm.valid) {
      const wasteRequest = this.wasteRequestForm.value;
      this.store.dispatch(WasteRequestActions.addWasteRequest({ request: wasteRequest }));
      this.message = 'Your waste collection request has been submitted successfully!';
      this.error = null;
    } else {
      this.error = 'Please fill in all required fields correctly.';
      this.message = null;
    }
  }
}
