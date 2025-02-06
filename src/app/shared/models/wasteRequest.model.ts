export interface WasteRequest {
    id: number; // Identifiant unique de la demande
    wasteType: 'plastic' | 'glass' | 'paper' | 'metal'; // Types de déchets autorisés
    wastePhotos?: string[]; // Photos des déchets (optionnel)
    estimatedWeight: number; // Poids estimé (minimum 1000g)
    collectionAddress: string; // Adresse de collecte
    preferredDateTime: Date; // Date et créneau horaire souhaités
    additionalNotes?: string; // Notes supplémentaires (optionnel)
    status: 'pending' | 'occupied' | 'ongoing' | 'validated' | 'rejected'; // Statut de la demande
    userId: number; // L'ID de l'utilisateur qui a créé la demande
  }
  