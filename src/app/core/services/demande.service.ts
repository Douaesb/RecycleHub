import { Injectable } from '@angular/core';
import { WasteRequest } from '../../shared/models/wasteRequest.model';
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
      id: Date.now() 
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
    const index = requests.findIndex(r => r.id === request.id);

    if (index !== -1 && requests[index].status === 'pending') {
      requests[index] = request;
      this.saveWasteRequests(requests);
    }
  }

  deleteWasteRequest(requestId: number): void {
    let requests = this.getWasteRequests();
    requests = requests.filter(r => r.id !== requestId);
    this.saveWasteRequests(requests);
  }

  private saveWasteRequests(requests: WasteRequest[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(requests));
  }

  updateWasteRequestStatus(id: number, status: WasteRequest['status']): Observable<WasteRequest | null> {
    const requests = this.getWasteRequests();
    const requestIndex = requests.findIndex((r) => r.id === id);
  
    if (requestIndex !== -1) {
      requests[requestIndex].status = status;
      this.saveWasteRequests(requests);
      return of(requests[requestIndex]);
    }
    return of(null);
  }
  
  
}
