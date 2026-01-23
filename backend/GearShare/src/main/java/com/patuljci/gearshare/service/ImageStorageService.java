package com.patuljci.gearshare.service;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageStorageService {

    private final Path imagesPath = Paths.get("userImages");
    
    public ImageStorageService() {
        try {
            Files.createDirectories(imagesPath);
        } catch (IOException e) {
            throw new RuntimeException("Cannot initialise image folder!!!");
        }
    }

    public void deleteOldImg(String imgPath) throws IOException {
        if (imgPath == null || imgPath.isEmpty()) {
            return;
        }

        Path dest = this.imagesPath.resolve(imgPath);

        if (Files.exists(dest)) {
            Files.delete(dest);
        }
    }

    public String saveImage(MultipartFile img) throws IOException {
        String filename = img.getOriginalFilename();
        String extension = filename.substring(filename.lastIndexOf('.'));
        String savedImgPath = UUID.randomUUID().toString() + extension;

        Path dest = this.imagesPath.resolve(savedImgPath);
        Files.copy(img.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);

        return savedImgPath;
    }
}

