package com.example.recipeapi.dto;

import java.util.List;

public class RecipeDto {
    private Long id;
    private String title;
    private String steps;
    private int time;
    private String image;
    private Long userId;
    private Long categoryId;
    private List<IngredientDto> ingredients;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSteps() {
        return steps;
    }

    public void setSteps(String steps) {
        this.steps = steps;
    }

    public int getTime() {
        return time;
    }

    public void setTime(int time) {
        this.time = time;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public List<IngredientDto> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<IngredientDto> ingredients) {
        this.ingredients = ingredients;
    }

    @Override
    public String toString() {
        return "RecipeDto{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", steps='" + steps + '\'' +
                ", time=" + time +
                ", image='" + image + '\'' +
                ", userId=" + userId +
                ", categoryId=" + categoryId +
                ", ingredients=" + ingredients +
                '}';
    }
}