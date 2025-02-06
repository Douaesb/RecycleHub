import { Injectable } from '@angular/core';
import { WasteRequest } from '../../shared/models/wasteRequest.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WasteRequestService {

  private storageKey = 'wasteRequests'; // Clé pour le stockage local

  constructor() {}

  // Ajouter une nouvelle demande de collecte
  addWasteRequest(request: WasteRequest): void {
    const requests = this.getWasteRequests();
    requests.push(request);
    this.saveWasteRequests(requests);
  }

  // Obtenir toutes les demandes de collecte
  getWasteRequests(): WasteRequest[] {
    const storedRequests = localStorage.getItem(this.storageKey);
    return storedRequests ? JSON.parse(storedRequests) : [];
  }

  // Modifier une demande de collecte (si le statut est "pending")
  updateWasteRequest(request: WasteRequest): void {
    const requests = this.getWasteRequests();
    const index = requests.findIndex(r => r.id === request.id);

    if (index !== -1 && requests[index].status === 'pending') {
      requests[index] = request;
      this.saveWasteRequests(requests);
    }
  }

  // Supprimer une demande de collecte
  deleteWasteRequest(requestId: number): void {
    let requests = this.getWasteRequests();
    requests = requests.filter(r => r.id !== requestId);
    this.saveWasteRequests(requests);
  }

  // Sauvegarder les demandes de collecte dans localStorage
  private saveWasteRequests(requests: WasteRequest[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(requests));
  }
}
