package com.example.recipeapi.controller;

import com.example.recipeapi.dto.RecipeDto;
import com.example.recipeapi.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    @Autowired
    private RecipeService recipeService;

    @GetMapping
    public List<RecipeDto> getAllRecipes() {
        return recipeService.getAllRecipes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeDto> getRecipeById(@PathVariable Long id) {
        RecipeDto recipeDto = recipeService.getRecipeById(id);
        return ResponseEntity.ok(recipeDto);
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<RecipeDto>> getRecipesByCategoryId(@PathVariable Long categoryId) {
        List<RecipeDto> recipes = recipeService.getRecipesByCategoryId(categoryId);
        return ResponseEntity.ok(recipes);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RecipeDto>> getRecipesByUserId(@PathVariable Long userId) {
        List<RecipeDto> recipes = recipeService.getRecipesByUserId(userId);
        return ResponseEntity.ok(recipes);
    }

    @GetMapping("/user/{userId}/category/{categoryId}")
    public ResponseEntity<List<RecipeDto>> getRecipesByUserIdAndCategoryId(
            @PathVariable Long userId,
            @PathVariable Long categoryId) {
        List<RecipeDto> recipes = recipeService.getRecipesByUserIdAndCategoryId(userId, categoryId);
        return ResponseEntity.ok(recipes);
    }

    @PostMapping
    public RecipeDto createRecipe(@RequestBody RecipeDto recipeDto) {
        return recipeService.createRecipe(recipeDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecipeDto> updateRecipe(@PathVariable Long id, @RequestBody RecipeDto recipeDto) {
        RecipeDto updatedRecipe = recipeService.updateRecipe(id, recipeDto);
        return ResponseEntity.ok(updatedRecipe);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id) {
        recipeService.deleteRecipe(id);
        return ResponseEntity.ok().build();
    }
}