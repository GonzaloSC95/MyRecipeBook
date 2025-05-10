package com.example.recipeapi.repository;

import com.example.recipeapi.model.Recipe;
import com.example.recipeapi.model.User;
import com.example.recipeapi.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByUser(User user);
    List<Recipe> findByCategory(Category category);
    List<Recipe> findByTitleContainingIgnoreCase(String title);
    List<Recipe> findByUserAndCategory(User user, Category category);
}