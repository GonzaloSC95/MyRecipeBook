package com.example.recipeapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.recipeapi.model.Category;
import com.example.recipeapi.model.User;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUser(User user);
    List<Category> findByUserId(Long userId);
    List<Category> findByNameContainingIgnoreCase(String name);
    boolean existsByNameAndUser(String name, User user);
}