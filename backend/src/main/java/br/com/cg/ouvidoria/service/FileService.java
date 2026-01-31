package br.com.cg.ouvidoria.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Serviço responsável pelo armazenamento de arquivos de mídia (áudio, imagem, vídeo)
 * no sistema de arquivos local. Os arquivos são salvos com nomes únicos (UUID)
 * para evitar conflitos.
 */
@Service
public class FileService {

    private final Path root = Paths.get("uploads").toAbsolutePath().normalize();

    public String salvar(MultipartFile file) {
        try {
            Files.createDirectories(root);
            String nomeArquivo = UUID.randomUUID() + "-" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), root.resolve(nomeArquivo));
            return "/uploads/" + nomeArquivo;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao salvar arquivo: " + e.getMessage());
        }
    }
}
