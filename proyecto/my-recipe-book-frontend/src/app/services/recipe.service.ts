import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private endpoint = 'recipes';

  constructor(private apiService: ApiService) {}

  getAllRecipes(): Observable<Recipe[]> {
    return this.apiService.get<Recipe[]>(this.endpoint);
  }

  getRecipeById(id: number): Observable<Recipe> {
    return this.apiService.getById<Recipe>(this.endpoint, id);
  }

  getRecipesByUserId(userId: number): Observable<Recipe[]> {
    return this.apiService.get<Recipe[]>(`${this.endpoint}/user/${userId}`);
  }

  getRecipesByCategoryId(categoryId: number): Observable<Recipe[]> {
    return this.apiService.get<Recipe[]>(
      `${this.endpoint}/category/${categoryId}`
    );
  }

  getUserRecipesByCategoryId(
    userId: number,
    categoryId: number
  ): Observable<Recipe[]> {
    return this.apiService.get<Recipe[]>(
      `${this.endpoint}/user/${userId}/category/${categoryId}`
    );
  }

  createRecipe(recipe: Recipe): Observable<Recipe> {
    return this.apiService.post<Recipe>(this.endpoint, recipe);
  }

  // Fixed method signature to match how it's being called
  updateRecipe(recipe: Recipe): Observable<Recipe> {
    if (recipe.id === undefined) {
      throw new Error('Recipe ID is required for updating a recipe.');
    }
    console.log('Updating recipe:', recipe.id, recipe, this.endpoint);
    return this.apiService.put<Recipe>(this.endpoint, recipe.id, recipe);
  }

  deleteRecipe(id: number): Observable<void> {
    return this.apiService.delete(this.endpoint, id);
  }
}
