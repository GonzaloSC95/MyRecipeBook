package com.example.recipeapi.service;

import com.example.recipeapi.model.Ingredient;
import com.example.recipeapi.model.Recipe;
import com.example.recipeapi.repository.IngredientRepository;
import com.example.recipeapi.repository.RecipeRepository;
import com.example.recipeapi.dto.IngredientDto;
import com.example.recipeapi.exception.ResourceNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IngredientService {

    @Autowired
    private IngredientRepository ingredientRepository;
    
    @Autowired
    private RecipeRepository recipeRepository;

    public List<IngredientDto> getAllIngredients() {
        return ingredientRepository.findAll().stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public IngredientDto getIngredientById(Long id) {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ingredient not found with id: " + id));
        return convertToDto(ingredient);
    }
    
    public List<IngredientDto> getIngredientsByRecipeId(Long recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found with id: " + recipeId));
                
        return ingredientRepository.findByRecipe(recipe).stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public IngredientDto createIngredient(IngredientDto ingredientDto) {
        Ingredient ingredient = convertToEntity(ingredientDto);
        Ingredient savedIngredient = ingredientRepository.save(ingredient);
        return convertToDto(savedIngredient);
    }

    public IngredientDto updateIngredient(Long id, IngredientDto ingredientDto) {
        Ingredient existingIngredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ingredient not found with id: " + id));
        
        existingIngredient.setName(ingredientDto.getName());
        existingIngredient.setQuantity(ingredientDto.getQuantity());
        
        // Update recipe if specified
        if (ingredientDto.getRecipeId() != null) {
            Recipe recipe = recipeRepository.findById(ingredientDto.getRecipeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Recipe not found with id: " + ingredientDto.getRecipeId()));
            existingIngredient.setRecipe(recipe);
        }
        
        Ingredient updatedIngredient = ingredientRepository.save(existingIngredient);
        return convertToDto(updatedIngredient);
    }

    public void deleteIngredient(Long id) {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ingredient not found with id: " + id));
        ingredientRepository.delete(ingredient);
    }
    
    private IngredientDto convertToDto(Ingredient ingredient) {
        IngredientDto ingredientDto = new IngredientDto();
        ingredientDto.setId(ingredient.getId());
        ingredientDto.setName(ingredient.getName());
        ingredientDto.setQuantity(ingredient.getQuantity());
        ingredientDto.setRecipeId(ingredient.getRecipe().getId());
        return ingredientDto;
    }
    
    private Ingredient convertToEntity(IngredientDto ingredientDto) {
        Ingredient ingredient = new Ingredient();
        ingredient.setId(ingredientDto.getId());
        ingredient.setName(ingredientDto.getName());
        ingredient.setQuantity(ingredientDto.getQuantity());
        
        if (ingredientDto.getRecipeId() != null) {
            Recipe recipe = recipeRepository.findById(ingredientDto.getRecipeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Recipe not found with id: " + ingredientDto.getRecipeId()));
            ingredient.setRecipe(recipe);
        }
        
        return ingredient;
    }
}