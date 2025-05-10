import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';

export const CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./category-list/category-list.component').then(m => m.CategoryListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'new',
    loadComponent: () => import('./category-form/category-form.component').then(m => m.CategoryFormComponent),
    canActivate: [authGuard]
  },
  {
    path: ':id',
    loadComponent: () => import('./category-detail/category-detail.component').then(m => m.CategoryDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./category-form/category-form.component').then(m => m.CategoryFormComponent),
    canActivate: [authGuard]
  }
];