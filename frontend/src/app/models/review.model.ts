import { AppUser } from './user.model';

export interface Review {
  reviewId?: number;
  userId: string;
  user?: AppUser;
  menuId: number;
  rating: number;
  comment: string;
  created?: string;
}
