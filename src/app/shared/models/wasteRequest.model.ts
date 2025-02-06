export type WasteType = 'plastic' | 'glass' | 'paper' | 'metal';

export interface WasteRequest {
  id?: number;
  wasteTypes: WasteType[];
  wastePhotos?: string[];
  estimatedWeight: number;
  collectionAddress: string;
  preferredDateTime: Date;
  additionalNotes?: string;
  status: 'pending' | 'occupied' | 'ongoing' | 'validated' | 'rejected';
  userId: number;
}
