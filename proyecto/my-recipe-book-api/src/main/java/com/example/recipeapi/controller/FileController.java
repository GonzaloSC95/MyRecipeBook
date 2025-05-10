package com.example.recipeapi.controller;

import com.example.recipeapi.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/api/upload")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam() MultipartFile file,
            @RequestParam() String type) {
        
        // Validate file type (recipe or category)
        if (!type.equals("recipe") && !type.equals("category")) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Invalid type. Must be 'recipe' or 'category'.");
            return ResponseEntity.badRequest().body(response);
        }
        
        String fileUrl = fileStorageService.storeFile(file, type);
        
        Map<String, String> response = new HashMap<>();
        response.put("fileUrl", fileUrl);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/uploads/{type}/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable String type,
            @PathVariable String fileName,
            HttpServletRequest request) {
        
        // Validate file type (recipe or category)
        if (!type.equals("recipe") && !type.equals("category")) {
            return ResponseEntity.badRequest().build();
        }
        
        // Load file as Resource
        Resource resource = fileStorageService.loadFileAsResource(fileName, type);

        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            // Fallback to a default content type
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}