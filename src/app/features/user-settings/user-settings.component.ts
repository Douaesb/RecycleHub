import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../shared/models/auth.model';
import { updateUser, deleteUser } from '../../store/auth/auth.actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class UserSettingsComponent implements OnInit {
  userForm: FormGroup;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store: Store,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        zipCode: ['', Validators.required],
      }),
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.userForm.patchValue(this.currentUser);
    }
  }

  onSave(): void {
    if (this.userForm.valid && this.currentUser) {
      const updatedUser = { ...this.currentUser, ...this.userForm.value };
      this.store.dispatch(updateUser({ user: updatedUser }));
      alert('User information updated successfully.');
    }
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete your account?')) {
      this.store.dispatch(deleteUser({ userId: this.currentUser?.id! }));
      alert('Account deleted successfully.');
      this.router.navigate(['/login']);
    }
  }
}
