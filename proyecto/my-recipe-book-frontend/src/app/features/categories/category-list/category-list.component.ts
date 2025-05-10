import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CategoryService } from '../../../services/category.service';
import { AuthService } from '../../../services/auth.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './category-list.component.html',
  //styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router // Add router for navigation
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;

    const userId = this.authService.currentUserValue?.id;

    if (!userId) {
      this.error = 'User not authenticated';
      this.loading = false;
      return;
    }

    // Let's try to debug the issue by first trying to get all categories
    this.categoryService.getCategories().subscribe({
      next: (allCategories) => {
        console.log('All categories:', allCategories);

        // Now get user-specific categories
        this.categoryService.getCategoriesByUserId(userId).subscribe({
          next: (userCategories) => {
            console.log('User categories:', userCategories);
            this.categories = userCategories;
            this.loading = false;
          },
          error: (err) => {
            console.error('Error fetching user categories:', err);
            // Fall back to all categories if user-specific query fails
            this.categories = allCategories.filter(cat => cat.userId === userId);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error fetching all categories:', err);
        this.error = 'Failed to load categories';
        this.loading = false;
      }
    });
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.categories = this.categories.filter(c => c.id !== id);
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          alert('Failed to delete category. Please try again.');
        }
      });
    }
  }

  // Add a manual refresh button
  refreshCategories(): void {
    this.loadCategories();
  }

  editCategory(categoryId: number | undefined): void {
    if (categoryId) {
      this.router.navigate(['/categories', categoryId]);
    }
  }
}
