export type VibeTag =
  | 'Street Flex'
  | 'Chill Walk'
  | 'Performance Grind'
  | 'Rare Flex'
  | 'Daily Driver'
  | 'Hype Beast'
  | 'Retro Vibe'
  | 'Tech Runner';

export interface Shoe {
  id: string;
  name: string;
  brand: string;
  price: number;
  purchaseDate: string; // ISO string
  tags: VibeTag[];
  wearCount: number;
  image: string; // base64 string
  createdAt: string; // ISO string
  
  // SteppedIn Society integration
  verified?: boolean;
  societyOrderNumber?: string;

  // Maintenance Log
  condition?: number; // 0-100
  lastCleaned?: string; // ISO string format
  cleaningNotes?: string;
}

export interface DiscoverShoe extends Shoe {
  ownerName: string;
  likes: number;
  isLiked?: boolean;
}
