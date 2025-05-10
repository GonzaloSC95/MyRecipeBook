import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Recipe } from '../../../models/recipe.model';
import { RecipeService } from '../../../services/recipe.service';
import { CategoryService } from '../../../services/category.service';
import { AuthService } from '../../../services/auth.service';
import { Category } from '../../../models/category.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, FormsModule],
  templateUrl: './recipe-list.component.html',
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  categories: Category[] = [];
  recipeCategories: Map<number, Category> = new Map(); // Map recipe ID to category
  loading: boolean = true;
  error: string | null = null;
  selectedCategoryId: number | null = null;
  currentUserId: number | null = null;

  constructor(
    private recipeService: RecipeService,
    private categoryService: CategoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get current user ID first
    this.currentUserId = this.authService.currentUserValue?.id ?? null;
    
    if (!this.currentUserId) {
      this.error = 'User not authenticated';
      this.loading = false;
      return;
    }
    
    // Load user's categories and recipes in parallel
    this.loadUserData();
  }

  loadUserData(): void {
    this.loading = true;
    
    // Assuming categoryService has a method to get categories by user ID
    this.categoryService.getCategoriesByUserId(this.currentUserId!).subscribe({
      next: (categories) => {
        this.categories = categories;
        
        // Create a lookup map for faster category retrieval
        categories.forEach(category => {
          if (category.id !== undefined) {
            this.recipeCategories.set(category.id, category);
          }
        });
        
        // Now load the user's recipes
        this.loadUserRecipes();
      },
      error: (err) => {
        console.error('Error loading user categories', err);
        this.error = 'Error loading your categories';
        this.loading = false;
      }
    });
  }

  loadUserRecipes(): void {
    if (!this.currentUserId) {
      this.error = 'User not authenticated';
      this.loading = false;
      return;
    }
    
    this.recipeService.getRecipesByUserId(this.currentUserId).subscribe({
      next: (recipes: Recipe[]) => {
        this.recipes = recipes;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading user recipes', err);
        this.error = 'Error loading your recipes';
        this.loading = false;
      }
    });
  }

  filterByCategory(): void {
    this.loading = true;
    
    if (!this.currentUserId) {
      this.error = 'User not authenticated';
      this.loading = false;
      return;
    }
    
    if (this.selectedCategoryId) {
      this.recipeService.getUserRecipesByCategoryId(this.currentUserId, this.selectedCategoryId).subscribe({
        next: (recipes: Recipe[]) => {
          this.recipes = recipes;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error filtering recipes', err);
          this.error = 'Error filtering recipes';
          this.loading = false;
        }
      });
    } else {
      this.loadUserRecipes();
    }
  }

  // Helper method to get category for a recipe in the template
  getCategoryForRecipe(recipe: Recipe): Category | undefined {
    if (!recipe.categoryId) {
      return undefined;
    }
    
    const categoryId = Number(recipe.categoryId);
    return this.recipeCategories.get(categoryId);
  }
}
