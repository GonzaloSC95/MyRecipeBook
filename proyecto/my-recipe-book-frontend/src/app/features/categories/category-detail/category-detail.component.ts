import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CategoryService } from '../../../services/category.service';
import { RecipeService } from '../../../services/recipe.service';
import { Category } from '../../../models/category.model';
import { Recipe } from '../../../models/recipe.model';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './category-detail.component.html',
})
export class CategoryDetailComponent implements OnInit {
  category: Category | null = null;
  recipes: Recipe[] = [];
  loading = true;
  error: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private recipeService: RecipeService
  ) {}
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        const categoryId = +params['id'];
        this.loadCategory(categoryId);
        this.loadRecipes(categoryId);
      } else {
        this.error = 'Category ID not provided';
        this.loading = false;
      }
    });
  }
  
  loadCategory(id: number): void {
    this.categoryService.getCategoryById(id).subscribe({
      next: (category) => {
        this.category = category;
      },
      error: (err) => {
        console.error('Error loading category:', err);
        this.error = 'Failed to load category details';
        this.loading = false;
      }
    });
  }
  
  loadRecipes(categoryId: number): void {
    this.recipeService.getRecipesByCategoryId(categoryId).subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading recipes:', err);
        this.error = 'Failed to load recipes for this category';
        this.loading = false;
      }
    });
  }
  
  editCategory(): void {
    if (this.category && this.category.id) {
      this.router.navigate(['/categories', this.category.id, 'edit']);
    }
  }
}