import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { User } from '../../shared/models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'recycleHubToken';
  private readonly USERS_KEY = 'recycleHubUsers';

  constructor() {
    this.initializeCollectors();
  }

  private initializeCollectors() {
    const users = this.getUsers();
    if (users.filter((user) => user.type === 'collecteur').length < 3) {
      const collectors = [
        {
          email: 'collector1@example.com',
          password: btoa('password1'),
          fullName: 'John Doe',
          address: '123 Green Street, Recycle City',
          phone: '1234567890',
          birthDate: '1990-01-01',
          photoUrl: '',
          type: 'collecteur',
        },
        {
          email: 'collector2@example.com',
          password: btoa('password2'),
          fullName: 'Jane Smith',
          address: '456 Eco Avenue, Recycle Town',
          phone: '0987654321',
          birthDate: '1985-05-10',
          photoUrl: '',
          type: 'collecteur',
        },
        {
          email: 'collector3@example.com',
          password: btoa('password3'),
          fullName: 'Robert Green',
          address: '789 Sustainability Blvd, EcoCity',
          phone: '5678901234',
          birthDate: '1992-09-15',
          photoUrl: '',
          type: 'collecteur',
        },
      ];
      this.saveUsers([...users, ...collectors]);
    }
  }

  register(user: User): Observable<{ success: boolean; message: string }> {
    const validation = this.validateRegistration(user);
    if (!validation.success) {
      return throwError(() => new Error(validation.message));
    }

    const users = this.getUsers();
    if (users.some((existingUser) => existingUser.email === user.email)) {
      return throwError(() => new Error('Email already exists.'));
    }

    users.push({
      ...user,
      password: btoa(user.password),
      type: 'particulier',
    });

    this.saveUsers(users);
    return of({ success: true, message: 'Registration successful.' }).pipe(
      delay(1000)
    );
  }

  authenticate(email: string, password: string): Observable<{ email: string; fullName: string }> {
    if (!email || !this.validateEmail(email)) {
      return throwError(() => new Error('Invalid email format.'));
    }

    if (!password) {
      return throwError(() => new Error('Password is required.'));
    }

    const users = this.getUsers();
    const user = users.find(u => u.email === email && atob(u.password) === password);

    if (user) {
      const token = btoa(JSON.stringify({ email, expiry: Date.now() + 3600000 }));
      localStorage.setItem(this.TOKEN_KEY, token);
      return of({ email: user.email, fullName: user.fullName }).pipe(delay(1000));
    }

    return throwError(() => new Error('Invalid email or password.'));
  }
  
  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token));
      return payload.expiry > Date.now();
    } catch {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getUserInfo(): any {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return null;

    const payload = JSON.parse(atob(token));
    return this.getUsers().find((user) => user.email === payload.email);
  }

  updateUserInfo(updatedUser: any): boolean {
    const users = this.getUsers();
    const userIndex = users.findIndex(
      (user) => user.email === updatedUser.email
    );

    if (userIndex === -1) return false;

    users[userIndex] = { ...users[userIndex], ...updatedUser };
    this.saveUsers(users);
    return true;
  }

  deleteUser(email: string): void {
    const users = this.getUsers().filter((user) => user.email !== email);
    this.saveUsers(users);
    this.logout();
  }

  private validateRegistration(user: any): {
    success: boolean;
    message: string;
  } {
    if (!user.email || !this.validateEmail(user.email)) {
      return { success: false, message: 'Invalid email address.' };
    }

    if (!user.password || !this.validatePassword(user.password)) {
      return {
        success: false,
        message:
          'Password must be at least 8 characters, include uppercase, lowercase, and a number.',
      };
    }

    if (!user.fullName || user.fullName.trim().split(' ').length < 2) {
      return {
        success: false,
        message: 'Full name must contain at least two words.',
      };
    }

    if (!user.address) {
      return { success: false, message: 'Address is required.' };
    }

    if (!user.phone || !/^\d{10}$/.test(user.phone)) {
      return { success: false, message: 'Phone number must be 10 digits.' };
    }

    if (!user.birthDate || isNaN(Date.parse(user.birthDate))) {
      return { success: false, message: 'Invalid birth date.' };
    }

    return { success: true, message: 'Validation successful.' };
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  }

  private getUsers(): any[] {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  }

  private saveUsers(users: any[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }
}
