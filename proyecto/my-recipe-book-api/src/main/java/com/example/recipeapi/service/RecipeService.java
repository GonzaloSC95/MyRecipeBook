package com.example.recipeapi.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.recipeapi.dto.IngredientDto;
import com.example.recipeapi.dto.RecipeDto;
import com.example.recipeapi.exception.ResourceNotFoundException;
import com.example.recipeapi.model.Category;
import com.example.recipeapi.model.Ingredient;
import com.example.recipeapi.model.Recipe;
import com.example.recipeapi.model.User;
import com.example.recipeapi.repository.CategoryRepository;
import com.example.recipeapi.repository.RecipeRepository;
import com.example.recipeapi.repository.UserRepository;

@Service
public class RecipeService {

    @Autowired
    private RecipeRepository recipeRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IngredientService ingredientService;
    
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public List<RecipeDto> getAllRecipes() {
        return recipeRepository.findAll().stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public RecipeDto getRecipeById(Long id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found with id: " + id));
        return convertToDto(recipe);
    }
    
    public List<RecipeDto> getRecipesByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
                
        return recipeRepository.findByUser(user).stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    public List<RecipeDto> getRecipesByCategoryId(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
                
        return recipeRepository.findByCategory(category).stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public List<RecipeDto> getRecipesByUserIdAndCategoryId(Long userId, Long categoryId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
                
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
                
        return recipeRepository.findByUserAndCategory(user, category).stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public RecipeDto createRecipe(RecipeDto recipeDto) {
        Recipe recipe = convertToEntity(recipeDto);
        Recipe savedRecipe = recipeRepository.save(recipe);
        return convertToDto(savedRecipe);
    }

    public RecipeDto updateRecipe(Long id, RecipeDto recipeDto) {
        Recipe existingRecipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found with id: " + id));
        
        // Check if image is being updated - compare current DB value with new value
        String existingImage = existingRecipe.getImage();
        String newImage = recipeDto.getImage();
        
        if (newImage != null && existingImage != null && !newImage.equals(existingImage)) {
            // Only delete old image if URLs are different and old URL is not null/empty
            fileStorageService.deleteFile(existingImage);
            System.out.println("Deleting old recipe image: " + existingImage);
        }
        
        // Update the recipe fields
        existingRecipe.setTitle(recipeDto.getTitle());
        existingRecipe.setSteps(recipeDto.getSteps());
        existingRecipe.setTime(recipeDto.getTime());
        
        // Only update image if it's provided
        if (newImage != null) {
            existingRecipe.setImage(newImage);
        }
        
        // Update category if provided
        if (recipeDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(recipeDto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + recipeDto.getCategoryId()));
            existingRecipe.setCategory(category);
        }
        
        // Update user if provided
        if (recipeDto.getUserId() != null) {
            User user = userRepository.findById(recipeDto.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + recipeDto.getUserId()));
            existingRecipe.setUser(user);
        }

        // Update ingredients
        if (recipeDto.getIngredients() != null && !recipeDto.getIngredients().isEmpty()) {
            // Save the new ingredients
            Set<IngredientDto> ingredients = recipeDto.getIngredients().stream()
                .map(ingredientDto -> {
                    System.out.println("Saving ingredient: " + ingredientDto.getName() + " - " + ingredientDto.getId());
                    return ingredientService.createIngredient(ingredientDto);
                })
                .collect(Collectors.toSet());
            // Clear the old ingredients
            for (Ingredient ingredient : existingRecipe.getIngredients()) {
                // Check if the ingredient is not in the new list
                try {
                    ingredients.stream()
                        .filter(ingredientDto -> !(ingredientDto.getId().equals(ingredient.getId())))
                        .findFirst()
                        .ifPresent(ingredientDto -> {
                            // If the ingredient is not in the new list, delete it
                            ingredientService.deleteIngredient(ingredient.getId());
                        });
                } catch (Exception e) {
                    System.out.println("Error deleting ingredient: " + ingredient.getName() + " - " + ingredient.getId());
                    e.printStackTrace();
                }
            }
            // Clear the existing ingredients to avoid duplicates
            existingRecipe.getIngredients().clear();
            // Set the new ingredients
            ingredients.forEach(ingredientDto -> {
                Ingredient ingredient = new Ingredient();
                ingredient.setName(ingredientDto.getName());
                ingredient.setQuantity(ingredientDto.getQuantity());
                ingredient.setRecipe(existingRecipe); // Set the recipe reference
                existingRecipe.getIngredients().add(ingredient);
            });
        }
        
        // Save the updated recipe
        Recipe updatedRecipe = recipeRepository.save(existingRecipe);
        return convertToDto(updatedRecipe);
    }

    public void deleteRecipe(Long id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found with id: " + id));
                
        // Delete the recipe image if it exists
        if (recipe.getImage() != null && !recipe.getImage().isEmpty()) {
            boolean deleted = fileStorageService.deleteFile(recipe.getImage());
            System.out.println("Deleting recipe image on delete: " + recipe.getImage() + " - Success: " + deleted);
        }
        
        recipeRepository.delete(recipe);
    }
    
    private RecipeDto convertToDto(Recipe recipe) {
        RecipeDto recipeDto = new RecipeDto();
        recipeDto.setId(recipe.getId());
        recipeDto.setTitle(recipe.getTitle());
        recipeDto.setSteps(recipe.getSteps());
        recipeDto.setTime(recipe.getTime());
        recipeDto.setImage(recipe.getImage());
        recipeDto.setUserId(recipe.getUser().getId());
        recipeDto.setCategoryId(recipe.getCategory().getId());
        
        // Map ingredients to DTOs
        if (recipe.getIngredients() != null) {
            recipeDto.setIngredients(
                recipe.getIngredients().stream()
                    .map(ingredient -> {
                        IngredientDto ingredientDto = new IngredientDto();
                        ingredientDto.setId(ingredient.getId());
                        ingredientDto.setName(ingredient.getName());
                        ingredientDto.setQuantity(ingredient.getQuantity());
                        ingredientDto.setRecipeId(recipe.getId());
                        return ingredientDto;
                    })
                    .collect(Collectors.toList())
            );
        }
        
        return recipeDto;
    }
    
    private Recipe convertToEntity(RecipeDto recipeDto) {
        Recipe recipe = new Recipe();
        recipe.setId(recipeDto.getId());
        recipe.setTitle(recipeDto.getTitle());
        recipe.setSteps(recipeDto.getSteps());
        recipe.setTime(recipeDto.getTime());
        recipe.setImage(recipeDto.getImage());
        
        if (recipeDto.getUserId() != null) {
            User user = userRepository.findById(recipeDto.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + recipeDto.getUserId()));
            recipe.setUser(user);
        }
        
        if (recipeDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(recipeDto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + recipeDto.getCategoryId()));
            recipe.setCategory(category);
        }
        
        // Handle ingredients
        if (recipeDto.getIngredients() != null && !recipeDto.getIngredients().isEmpty()) {
            Set<Ingredient> ingredients = recipeDto.getIngredients().stream()
                .map(ingredientDto -> {
                    Ingredient ingredient = new Ingredient();
                    ingredient.setName(ingredientDto.getName());
                    ingredient.setQuantity(ingredientDto.getQuantity());
                    ingredient.setRecipe(recipe); // Set the recipe reference
                    return ingredient;
                })
                .collect(Collectors.toSet());
            recipe.setIngredients(ingredients);
        }
        
        return recipe;
    }
}