package br.com.cg.ouvidoria.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileService {
    // Usar um caminho absoluto ou configurável via application.properties é mais seguro
    private final Path root = Paths.get("uploads").toAbsolutePath().normalize();

    public String salvar(MultipartFile file) {
        try {
            // Cria a pasta se não existir (seja no container ou na sua máquina)
            Files.createDirectories(root);

            String nomeArquivo = UUID.randomUUID() + "-" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), root.resolve(nomeArquivo));

            // Retorna o caminho que o WebConfig vai interceptar
            return "/uploads/" + nomeArquivo;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao salvar arquivo: " + e.getMessage());
        }
    }
}
