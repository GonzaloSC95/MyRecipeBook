import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { 
    path: 'recipes',
    loadChildren: () => import('./features/recipes/recipes.routes').then(m => m.RECIPES_ROUTES),
    canActivate: [authGuard]  // Add auth guard here
  },
  {
    path: 'categories',
    loadChildren: () => import('./features/categories/categories.routes').then(m => m.CATEGORIES_ROUTES),
    canActivate: [authGuard]  // Add auth guard here
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  { path: '**', redirectTo: '/recipes' }
];
