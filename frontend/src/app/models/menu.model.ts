import { Category } from './category.model';

export interface Menu {
  menuId: number;
  name: string;
  description?: string;
  price: number;
  pictureOfFood?: string;
  categoryId: number;
  category?: Category;
}
