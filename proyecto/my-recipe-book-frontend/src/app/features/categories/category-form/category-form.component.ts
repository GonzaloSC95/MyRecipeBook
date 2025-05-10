import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CategoryService } from '../../../services/category.service';
import { AuthService } from '../../../services/auth.service';
import { Category } from '../../../models/category.model';
import { FileUploadService } from '../../../services/file-upload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, TranslateModule],
  templateUrl: './category-form.component.html',
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode = false;
  categoryId?: number;
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
    private categoryService: CategoryService,
    private authService: AuthService,
    private fileUploadService: FileUploadService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
      image: [''] // This will store the path after upload
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.categoryId = +params['id'];
        this.loadCategory();
      }
    });
  }

  loadCategory(): void {
    if (this.categoryId) {
      this.loading = true;
      this.categoryService.getCategoryById(this.categoryId).subscribe({
        next: (category) => {
          this.categoryForm.patchValue({
            name: category.name,
            image: category.image || ''
          });
          
          // Set the preview URL if there's an existing image
          if (category.image) {
            this.imagePreviewUrl = category.image;
          }
          
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading category:', error);
          this.error = 'Failed to load category details';
          this.loading = false;
        }
      });
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
      
      this.fileUploadService.upload(this.selectedFile, 'category').subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            // Debug the response to see its structure
            console.log('Upload response:', event.body);
            
            // Get the file URL from the response - using fileUrl instead of filePath
            const fileUrl = event.body.fileUrl;
            
            if (fileUrl) {
              console.log('File URL received:', fileUrl);
              this.categoryForm.patchValue({ image: fileUrl });
              this.uploadSuccess = true;
              
              // Now submit the form with the file URL
              this.submitCategoryData();
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
      this.submitCategoryData();
    }
  }
  
  // Final form submission after file upload (if any)
  submitCategoryData(): void {
    const userId = this.authService.currentUserValue?.id;
    
    if (!userId) {
      this.error = 'User not authenticated';
      this.loading = false;
      return;
    }
    
    const categoryData: Category = {
      name: this.categoryForm.value.name,
      userId: userId,
      image: this.categoryForm.value.image || ''
    };
    
    if (this.isEditMode && this.categoryId) {
      categoryData.id = this.categoryId;
      this.categoryService.updateCategory(categoryData).subscribe({
        next: (category) => {
          console.log('Category updated successfully:', category);
          this.router.navigate(['/categories']);
        },
        error: (error) => {
          console.error('Error updating category:', error);
          this.error = 'Failed to update category';
          this.loading = false;
        }
      });
    } else {
      this.categoryService.createCategory(categoryData).subscribe({
        next: (category) => {
          console.log('Category created successfully:', category);
          this.router.navigate(['/categories']);
        },
        error: (error) => {
          console.error('Error creating category:', error);
          this.error = 'Failed to create category';
          this.loading = false;
        }
      });
    }
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.categoryForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.error = null;
    
    // If there's a file to upload, handle that first
    if (this.selectedFile) {
      this.uploadFileAndSubmitForm();
    } else {
      // Otherwise just submit the form directly
      this.submitCategoryData();
    }
  }
  
  // Reset file upload
  resetFileUpload(): void {
    this.selectedFile = null;
    this.imagePreviewUrl = this.categoryForm.value.image || null;
    this.uploadProgress = 0;
    this.uploadError = null;
  }
}