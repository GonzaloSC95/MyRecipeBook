import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Recipe } from '../../../models/recipe.model';
import { Category } from '../../../models/category.model';
import { Ingredient } from '../../../models/ingredient.model';
import { RecipeService } from '../../../services/recipe.service';
import { CategoryService } from '../../../services/category.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './recipe-detail.component.html',
  //styleUrl: './recipe-detail.component.scss'
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe | null = null;
  ingredients: Ingredient[] = [];
  category: Category | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private categoryService: CategoryService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    const recipeId = this.route.snapshot.paramMap.get('id');
    if (recipeId) {
      this.loadRecipe(+recipeId);
    } else {
      this.error = 'Recipe ID not provided';
      this.loading = false;
    }
  }

  loadRecipe(id: number): void {
    this.recipeService.getRecipeById(id).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
        if (recipe.ingredients) {
          this.ingredients = recipe.ingredients;
        }
        this.loadCategory(recipe.categoryId);
      },
      error: (err) => {
        this.error = 'Error loading recipe';
        this.loading = false;
        console.error(err);
      },
    });
  }

  loadCategory(id: number): void {
    this.categoryService.getCategoryById(id).subscribe({
      next: (category) => {
        this.category = category;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading category', err);
        this.loading = false;
      },
    });
  }

  openDeleteConfirmation(content: any): void {
    this.modalService.open(content, { centered: true }).result.then(
      (result) => {
        if (result === 'delete') {
          this.deleteRecipe();
        }
      },
      () => {} // Dismiss
    );
  }

  deleteRecipe(): void {
    if (this.recipe && this.recipe.id) {
      this.recipeService.deleteRecipe(this.recipe.id).subscribe({
        next: () => {
          this.router.navigate(['/recipes']);
        },
        error: (err) => {
          this.error = 'Error deleting recipe';
          console.error(err);
        },
      });
    }
  }
}
