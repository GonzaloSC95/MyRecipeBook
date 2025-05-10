package com.example.recipeapi.service;

import com.example.recipeapi.dto.CategoryDto;
import com.example.recipeapi.exception.ResourceNotFoundException;
import com.example.recipeapi.model.Category;
import com.example.recipeapi.model.User;
import com.example.recipeapi.repository.CategoryRepository;
import com.example.recipeapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FileStorageService fileStorageService;

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return convertToDto(category);
    }
    
    public List<CategoryDto> getCategoriesByUserId(Long userId) {
        return categoryRepository.findByUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public CategoryDto createCategory(CategoryDto categoryDto) {
        Category category = convertToEntity(categoryDto);
        Category savedCategory = categoryRepository.save(category);
        return convertToDto(savedCategory);
    }

    public CategoryDto updateCategory(Long id, CategoryDto categoryDto) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        
        // Check if image is being updated - compare current DB value with new value
        String existingImage = existingCategory.getImage();
        String newImage = categoryDto.getImage();
        
        if (newImage != null && existingImage != null && !newImage.equals(existingImage)) {
            // Only delete old image if URLs are different and old URL is not null/empty
            fileStorageService.deleteFile(existingImage);
            System.out.println("Deleting old category image: " + existingImage);
        }
        
        // Update category fields
        existingCategory.setName(categoryDto.getName());
        
        // Only update image if it's provided
        if (newImage != null) {
            existingCategory.setImage(newImage);
        }
        
        // Only update user if specified
        if (categoryDto.getUserId() != null) {
            User user = userRepository.findById(categoryDto.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + categoryDto.getUserId()));
            existingCategory.setUser(user);
        }
        
        Category updatedCategory = categoryRepository.save(existingCategory);
        return convertToDto(updatedCategory);
    }

    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
                
        // Delete the category image if it exists
        if (category.getImage() != null && !category.getImage().isEmpty()) {
            boolean deleted = fileStorageService.deleteFile(category.getImage());
            System.out.println("Deleting category image on delete: " + category.getImage() + " - Success: " + deleted);
        }
        
        categoryRepository.delete(category);
    }
    
    private CategoryDto convertToDto(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setImage(category.getImage());
        dto.setUserId(category.getUser().getId());
        return dto;
    }
    
    private Category convertToEntity(CategoryDto dto) {
        Category category = new Category();
        category.setName(dto.getName());
        category.setImage(dto.getImage());
        
        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.getUserId()));
            category.setUser(user);
        }
        
        return category;
    }
}