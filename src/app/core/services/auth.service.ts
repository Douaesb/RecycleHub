import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../../shared/models/auth.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'recyclehub_users';
  private readonly SESSION_KEY = 'recyclehub_current_user';

  constructor(private router: Router) {
    this.initializeCollectors();
  }

  login(email: string, password: string): Observable<User> {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      return of(user).pipe(
        delay(1000),
        tap(u => {
          this.setCurrentUser(u);
        })
      );
    }

    return throwError(() => new Error('Invalid credentials'));
  }

  register(userData: Omit<User, 'id' | 'role' | 'points'>): Observable<User> {
    const users = this.getUsers();
    
    if (users.some(u => u.email === userData.email)) {
      return throwError(() => new Error('Email already exists'));
    }

    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      role: 'particulier',
      points: 0
    };

    users.push(newUser);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));

    return of(newUser).pipe(
      delay(1000),
      tap(u =>
        {
          this.setCurrentUser(u);
          this.router.navigate(['/waste-request-list']);
        })
    );
  }

  logout(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
  }

  private initializeCollectors(): void {
    const users = this.getUsers();
    if (users.length === 0) {
      const collectors: User[] = [
        {
          id: crypto.randomUUID(),
          email: 'collector1@recyclehub.com',
          password: 'collector123',
          firstName: 'John',
          lastName: 'Collector',
          address: {
            street: '123 Recycling St',
            city: 'Green City',
            zipCode: '10001'
          },
          phone: '1234567890',
          dateOfBirth: '1990-01-01',
          role: 'collecteur',
          points: 0
        },
        {
          id: crypto.randomUUID(),
          email: 'collector2@recyclehub.com',
          password: 'collector456',
          firstName: 'Jane',
          lastName: 'Eco',
          address: {
            street: '456 Reuse Ave',
            city: 'EcoVille',
            zipCode: '20002'
          },
          phone: '9876543210',
          dateOfBirth: '1985-05-10',
          role: 'collecteur',
          points: 0
        },
        {
          id: crypto.randomUUID(),
          email: 'collector3@recyclehub.com',
          password: 'collector789',
          firstName: 'Mark',
          lastName: 'Recycler',
          address: {
            street: '789 Compost Blvd',
            city: 'RecycleTown',
            zipCode: '30003'
          },
          phone: '5556667777',
          dateOfBirth: '1988-09-15',
          role: 'collecteur',
          points: 0
        }
      ];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(collectors));
    }
  }  

  private getUsers(): User[] {
    const users = localStorage.getItem(this.STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  }

  private setCurrentUser(user: User): void {
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
  }

  getCurrentUser(): User | null {
    const userString = sessionStorage.getItem('recyclehub_current_user');
    return userString ? JSON.parse(userString) : null;
  }
  
  updateUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
      this.setCurrentUser(user);
    }
  }
  
  deleteUser(userId: string): void {
    let users = this.getUsers();
    users = users.filter(u => u.id !== userId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    sessionStorage.removeItem(this.SESSION_KEY);
  }

}