import { Injectable } from '@angular/core';
import {
  WasteRequest,
  WasteType,
} from '../../shared/models/wasteRequest.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WasteRequestService {
  private storageKey = 'wasteRequests';

  constructor() {}

  addWasteRequest(request: WasteRequest): void {
    const requests = this.getWasteRequests();
    const newRequest = {
      ...request,
      id: Date.now(),
    };
    requests.push(newRequest);
    this.saveWasteRequests(requests);
  }

  getWasteRequests(): WasteRequest[] {
    const storedRequests = localStorage.getItem(this.storageKey);
    return storedRequests ? JSON.parse(storedRequests) : [];
  }

  updateWasteRequest(request: WasteRequest): void {
    const requests = this.getWasteRequests();
    const index = requests.findIndex((r) => r.id === request.id);

    if (index !== -1 && requests[index].status === 'pending') {
      requests[index] = request;
      this.saveWasteRequests(requests);
    }
  }

  deleteWasteRequest(requestId: number): void {
    let requests = this.getWasteRequests();
    requests = requests.filter((r) => r.id !== requestId);
    this.saveWasteRequests(requests);
  }

  private saveWasteRequests(requests: WasteRequest[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(requests));
  }

  updateWasteRequestStatus(
    id: number,
    status: WasteRequest['status']
  ): Observable<WasteRequest | null> {
    const requests = this.getWasteRequests();
    const requestIndex = requests.findIndex((r) => r.id === id);

    if (requestIndex !== -1) {
      requests[requestIndex].status = status;

      if (status === 'validated') {
        this.addPointsFromRequest(requests[requestIndex]);
      }

      this.saveWasteRequests(requests);
      return of(requests[requestIndex]);
    }
    return of(null);
  }

  addPointsFromRequest(request: WasteRequest): void {
    const pointRates: Record<WasteType, number> = {
      plastic: 2,
      glass: 1,
      paper: 1,
      metal: 5,
    };

    const pointsEarned = Object.entries(request.wasteWeights || {}).reduce(
      (sum, [type, weight]) => {
        const pointsForType =
          (pointRates[type as WasteType] || 0) * (weight / 1000);
        return sum + pointsForType;
      },
      0
    );

    const currentPoints = this.getUserPoints(String(request.userId));
    this.saveUserPoints(String(request.userId), currentPoints + pointsEarned);
  }

  addUserPoints(userId: string, points: number): void {
    console.log('Adding Points:', points, 'For User:', userId);
    const userPoints = this.getUserPoints(userId);
    this.saveUserPoints(userId, userPoints + points);
  }
  
  getUserPoints(userId: string): number {
    const storedPoints = JSON.parse(localStorage.getItem('userPoints') || '{}');
    return storedPoints[userId] || 0;
  }
  
  saveUserPoints(userId: string, points: number): void {
    const storedPoints = JSON.parse(localStorage.getItem('userPoints') || '{}');
    storedPoints[userId] = points;
    localStorage.setItem('userPoints', JSON.stringify(storedPoints));
  }
  
  resetUserPoints(userId: string): void {
    this.saveUserPoints(userId, 0);
  }

  reduceUserPoints(userId: string, points: number): void {
    const currentPoints = this.getUserPoints(userId);
    if (currentPoints >= points) {
      this.saveUserPoints(userId, currentPoints - points);
    } else {
      console.error('Insufficient points to redeem');
    }
  }  
  
}
