import { Ingredient } from './ingredient.model';

export interface Recipe {
  id?: number;
  title: string;
  steps: string;
  time: number;
  image?: string;
  userId: number;
  categoryId: number;
  ingredients?: Ingredient[];
}