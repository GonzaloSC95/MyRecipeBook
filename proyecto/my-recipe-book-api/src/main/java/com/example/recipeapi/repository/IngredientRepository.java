package com.example.recipeapi.repository;

import com.example.recipeapi.model.Ingredient;
import com.example.recipeapi.model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    List<Ingredient> findByRecipe(Recipe recipe);
    List<Ingredient> findByNameContainingIgnoreCase(String name);
    void deleteByRecipe(Recipe recipe);
}