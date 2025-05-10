import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ingredient } from '../models/ingredient.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private endpoint = 'ingredients';

  constructor(private apiService: ApiService) {}

  getAllIngredients(): Observable<Ingredient[]> {
    return this.apiService.get<Ingredient[]>(this.endpoint);
  }

  getIngredientById(id: number): Observable<Ingredient> {
    return this.apiService.getById<Ingredient>(this.endpoint, id);
  }

  getIngredientsByRecipeId(recipeId: number): Observable<Ingredient[]> {
    return this.apiService.get<Ingredient[]>(`${this.endpoint}/recipe/${recipeId}`);
  }

  createIngredient(ingredient: Ingredient): Observable<Ingredient> {
    return this.apiService.post<Ingredient>(this.endpoint, ingredient);
  }

  updateIngredient(id: number, ingredient: Ingredient): Observable<Ingredient> {
    return this.apiService.put<Ingredient>(this.endpoint, id, ingredient);
  }

  deleteIngredient(id: number): Observable<void> {
    return this.apiService.delete(this.endpoint, id);
  }
}