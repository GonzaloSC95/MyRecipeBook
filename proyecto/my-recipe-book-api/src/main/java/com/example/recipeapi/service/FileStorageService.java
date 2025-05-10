package com.example.recipeapi.service;

import com.example.recipeapi.config.FileStorageProperties;
import com.example.recipeapi.exception.ResourceNotFoundException;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageService(FileStorageProperties fileStorageProperties) {
        this.fileStorageLocation = Paths.get(fileStorageProperties.getUploadDir())
                .toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    //@SuppressWarnings("null")
    public String storeFile(MultipartFile file, String type) {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = "";
        
        // Extract file extension
        int i = originalFileName.lastIndexOf('.');
        if (i > 0) {
            fileExtension = originalFileName.substring(i);
        }
        
        // Generate unique filename with UUID
        String fileName = UUID.randomUUID().toString() + fileExtension;

        try {
            // Create directory for the specific type if it doesn't exist
            Path typePath = this.fileStorageLocation.resolve(type);
            if (!Files.exists(typePath)) {
                Files.createDirectories(typePath);
            }
            
            // Save file to the appropriate directory
            Path targetLocation = typePath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Create file download URL
            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/uploads/")
                    .path(type + "/")
                    .path(fileName)
                    .toUriString();
                    
            return fileDownloadUri;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }
    
    /**
     * Delete file from storage
     * @param fileUrl the URL of the file to delete
     * @return true if file was deleted, false otherwise
     */
    public boolean deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            System.out.println("Cannot delete null or empty file URL");
            return false;
        }
        
        try {
            // Extract the file path from the URL
            String apiUploadsPath = "/api/uploads/";
            int pathStartIndex = fileUrl.indexOf(apiUploadsPath);
            
            if (pathStartIndex == -1) {
                System.out.println("URL doesn't contain expected path pattern: " + fileUrl);
                return false;
            }
            
            // Get the relative path after /api/uploads/
            String relativePath = fileUrl.substring(pathStartIndex + apiUploadsPath.length());
            
            // Split into type and filename
            int slashIndex = relativePath.indexOf('/');
            if (slashIndex == -1) {
                System.out.println("Invalid relative path format: " + relativePath);
                return false;
            }
            
            String type = relativePath.substring(0, slashIndex);
            String fileName = relativePath.substring(slashIndex + 1);
            
            System.out.println("Attempting to delete file - Type: " + type + ", Filename: " + fileName);
            
            // Create path to the file
            Path filePath = this.fileStorageLocation.resolve(type).resolve(fileName);
            
            // Check if file exists
            if (Files.exists(filePath)) {
                // Delete the file
                Files.delete(filePath);
                System.out.println("Successfully deleted file: " + filePath);
                return true;
            } else {
                System.out.println("File does not exist: " + filePath);
                return false;
            }
            
        } catch (IOException ex) {
            // Log the exception
            System.err.println("Error deleting file: " + ex.getMessage());
            ex.printStackTrace();
            return false;
        }
    }

    public Resource loadFileAsResource(String fileName, String type) {
        try {
            Path filePath = this.fileStorageLocation.resolve(type).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found: " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("File not found: " + fileName, ex);
        }
    }
}