import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RecipeService } from '../../../services/recipe.service';
import { CategoryService } from '../../../services/category.service';
import { AuthService } from '../../../services/auth.service';
import { FileUploadService } from '../../../services/file-upload.service';
import { Recipe } from '../../../models/recipe.model';
import { Category } from '../../../models/category.model';
import { Ingredient } from '../../../models/ingredient.model';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, TranslateModule],
  templateUrl: './recipe-form.component.html',
})
export class RecipeFormComponent implements OnInit {
  recipeForm!: FormGroup;
  categories: Category[] = [];
  isEditMode = false;
  recipeId?: number;
  loading = false;
  submitted = false;
  error: string | null = null;

  // File upload properties
  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;
  uploadProgress = 0;
  uploadSuccess = false;
  uploadError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private fileUploadService: FileUploadService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadCategories();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.recipeId = +params['id'];
        this.loadRecipe();
      } else {
        // Add at least one ingredient field for new recipes
        this.addIngredient();
      }
    });
  }

  createForm(): void {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      steps: ['', Validators.required],
      time: [null, Validators.required],
      categoryId: ['', Validators.required],
      image: [''],
      ingredients: this.fb.array([])
    });
  }

  loadCategories(): void {
    const userId = this.authService.currentUserValue?.id;
    
    if (!userId) {
      this.error = 'User not authenticated';
      return;
    }
    
    this.loading = true;
    
    this.categoryService.getCategoriesByUserId(userId).subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
        
        if (categories.length === 0) {
          console.warn('No categories found for this user');
        }
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.error = 'Failed to load categories';
        this.loading = false;
      }
    });
  }

  loadRecipe(): void {
    if (!this.recipeId) return;

    this.loading = true;
    this.recipeService.getRecipeById(this.recipeId).subscribe({
      next: (recipe) => {
        console.log('Loaded recipe for edit:', recipe);
        
        // Patch form with recipe data
        this.recipeForm.patchValue({
          title: recipe.title,
          steps: recipe.steps,
          time: recipe.time,
          categoryId: recipe.categoryId,
          image: recipe.image || ''
        });

        // Set image preview if we have an image URL
        if (recipe.image) {
          this.imagePreviewUrl = recipe.image;
        }

        // Clear existing ingredients array
        this.ingredients.clear();

        // Add ingredients if they exist
        if (recipe.ingredients && recipe.ingredients.length > 0) {
          console.log('Recipe has ingredients:', recipe.ingredients);
          
          // Sort ingredients by ID before adding them to the form
          const sortedIngredients = [...recipe.ingredients].sort((a, b) => {
            // Handle undefined IDs - put new ingredients (without IDs) at the end
            if (!a.id) return 1;
            if (!b.id) return -1;
            return a.id - b.id;
          });
          
          sortedIngredients.forEach(ingredient => {
            // Create a form group for each ingredient from the DTO
            const ingredientGroup = this.createIngredientGroup({
              id: ingredient.id,
              name: ingredient.name,
              quantity: ingredient.quantity,
              recipeId: ingredient.recipeId
            });
            this.ingredients.push(ingredientGroup);
          });
        } else {
          // Add one empty ingredient form
          console.log('No ingredients found, adding empty ingredient field');
          this.addIngredient();
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading recipe:', error);
        this.error = 'Failed to load recipe details';
        this.loading = false;
      }
    });
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  createIngredientGroup(ingredient?: any): FormGroup {
    return this.fb.group({
      id: [ingredient?.id || null],
      tempId: [ingredient?.tempId || this.generateTempId()],
      name: [ingredient?.name || '', Validators.required],
      quantity: [ingredient?.quantity || ''],
      recipeId: [ingredient?.recipeId || null]
    });
  }

  private generateTempId(): string {
    return 'temp-' + new Date().getTime() + '-' + Math.floor(Math.random() * 1000);
  }

  addIngredient(): void {
    // Create and add the new ingredient
    this.ingredients.push(this.createIngredientGroup());
  }

  removeIngredient(index: number): void {
    // Only proceed if we have a valid index and more than one ingredient
    if (index >= 0 && index < this.ingredients.length && this.ingredients.length > 1) {
      // Remove the specific index from the FormArray
      this.ingredients.removeAt(index);
      
      // Log the action
      console.log('Ingredient removed at index', index);
    }
  }

  // Handle file selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Check file size and type
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        this.uploadError = 'File is too large. Max size is 5MB.';
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        this.uploadError = 'Invalid file type. Please upload a JPEG, PNG, or GIF image.';
        return;
      }
      
      this.selectedFile = file;
      this.uploadError = null;
      
      // Create a preview of the selected image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  // Upload the file and then submit the form
  uploadFileAndSubmitForm(): void {
    if (this.selectedFile) {
      this.uploadProgress = 0;
      this.uploadSuccess = false;
      this.uploadError = null;
      
      this.fileUploadService.upload(this.selectedFile, 'recipe').subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            console.log('Upload response:', event.body);
            
            // Get the file URL from the response - using fileUrl from your API
            const fileUrl = event.body.fileUrl;
            
            if (fileUrl) {
              console.log('File URL received:', fileUrl);
              this.recipeForm.patchValue({ image: fileUrl });
              this.uploadSuccess = true;
              
              // Now submit the form with the file URL
              this.submitRecipeData();
            } else {
              console.error('No file URL in response:', event.body);
              this.uploadError = 'Server did not return a file URL';
              this.loading = false;
            }
          }
        },
        error: (err) => {
          console.error('Upload error:', err);
          this.uploadError = 'Failed to upload image. Please try again.';
          this.loading = false;
        }
      });
    } else {
      // No new file selected, just submit the form with existing data
      this.submitRecipeData();
    }
  }
  
  // Submit form with or without image upload
  onSubmit(): void {
    this.submitted = true;
    
    if (this.recipeForm.invalid) {
      console.log('Form is invalid', this.recipeForm.value, this.recipeForm.errors);
      return;
    }
    
    this.loading = true;
    this.error = null;
    
    // If there's a file to upload, handle that first
    if (this.selectedFile) {
      this.uploadFileAndSubmitForm();
    } else {
      // Otherwise just submit the form directly
      this.submitRecipeData();
    }
  }

  // Final form submission after file upload (if any)
  submitRecipeData(): void {
    const userId = this.authService.currentUserValue?.id;
    
    if (!userId) {
      this.error = 'User not authenticated';
      this.loading = false;
      return;
    }
    
    // Create recipe data object
    const formValue = this.recipeForm.value;
    const recipeData: Recipe = {
      title: formValue.title,
      steps: formValue.steps,
      time: formValue.time,
      categoryId: formValue.categoryId,
      userId: userId,
      image: formValue.image || undefined,
      ingredients: formValue.ingredients.map((ing: any) => ({
        id: ing.id || undefined,
        name: ing.name,
        quantity: ing.quantity,
        recipeId: ing.recipeId || (this.isEditMode ? this.recipeId : undefined)
      }))
    };
    
    console.log('Submitting recipe with data:', recipeData);
    
    if (this.isEditMode && this.recipeId) {
      recipeData.id = this.recipeId;
      this.recipeService.updateRecipe(recipeData).subscribe({
        next: () => {
          this.router.navigate(['/recipes', this.recipeId]);
        },
        error: (error) => {
          console.error('Error updating recipe:', error);
          this.error = 'Failed to update recipe';
          this.loading = false;
        }
      });
    } else {
      this.recipeService.createRecipe(recipeData).subscribe({
        next: (response) => {
          this.router.navigate(['/recipes', response.id]);
        },
        error: (error) => {
          console.error('Error creating recipe:', error);
          this.error = 'Failed to create recipe';
          this.loading = false;
        }
      });
    }
  }
}