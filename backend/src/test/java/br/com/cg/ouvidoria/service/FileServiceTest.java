package br.com.cg.ouvidoria.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

@ExtendWith(MockitoExtension.class)
@DisplayName("Testes da FileService")
class FileServiceTest {

    @InjectMocks
    private FileService service;

    private MultipartFile fileMock;

    @BeforeEach
    void setUp() {
        fileMock = mock(MultipartFile.class);
    }

    @Test
    @DisplayName("Deve salvar arquivo com sucesso")
    void testSalvarArquivoComSucesso() throws IOException {
        when(fileMock.getOriginalFilename()).thenReturn("teste.mp3");
        when(fileMock.getInputStream()).thenReturn(new ByteArrayInputStream("áudio teste".getBytes()));

        String resultado = service.salvar(fileMock);

        assertNotNull(resultado);
        assertTrue(resultado.startsWith("/uploads/"));
        assertTrue(resultado.endsWith("teste.mp3"));
    }

    @Test
    @DisplayName("Deve gerar nomes únicos para cada arquivo")
    void testGerarNomesUnicos() throws IOException {
        when(fileMock.getOriginalFilename()).thenReturn("foto.jpg");
        when(fileMock.getInputStream()).thenReturn(new ByteArrayInputStream("imagem teste".getBytes()));

        String resultado1 = service.salvar(fileMock);
        String resultado2 = service.salvar(fileMock);

        assertNotEquals(resultado1, resultado2);
        assertTrue(resultado1.contains("foto.jpg"));
        assertTrue(resultado2.contains("foto.jpg"));
    }

    @Test
    @DisplayName("Deve salvar arquivo com extensão correta")
    void testSalvarComExtensaoCorreta() throws IOException {
        when(fileMock.getOriginalFilename()).thenReturn("video.mp4");
        when(fileMock.getInputStream()).thenReturn(new ByteArrayInputStream("vídeo teste".getBytes()));

        String resultado = service.salvar(fileMock);

        assertTrue(resultado.endsWith("video.mp4"));
    }

    @Test
    @DisplayName("Deve retornar URL com formato correto")
    void testRetornarURLComFormatoCorreto() throws IOException {
        when(fileMock.getOriginalFilename()).thenReturn("document.pdf");
        when(fileMock.getInputStream()).thenReturn(new ByteArrayInputStream("documento".getBytes()));

        String resultado = service.salvar(fileMock);

        assertFalse(resultado.matches("^/uploads/[a-f0-9\\-]+\\.pdf$"));
    }

    @Test
    @DisplayName("Deve lançar exceção ao salvar arquivo com erro")
    void testSalvarComErro() throws IOException {
        when(fileMock.getOriginalFilename()).thenReturn("arquivo.txt");
        when(fileMock.getInputStream()).thenThrow(new IOException("Erro ao ler arquivo"));

        assertThrows(RuntimeException.class, () -> service.salvar(fileMock));
    }

    @Test
    @DisplayName("Deve criar diretório uploads se não existir")
    void testCriarDiretorio() throws IOException {
        when(fileMock.getOriginalFilename()).thenReturn("teste.txt");
        when(fileMock.getInputStream()).thenReturn(new ByteArrayInputStream("conteúdo".getBytes()));

        service.salvar(fileMock);

        Path uploadsDir = Paths.get("uploads").toAbsolutePath().normalize();
        assertTrue(Files.exists(uploadsDir));
    }

    @Test
    @DisplayName("Deve salvar arquivo em diretório uploads")
    void testSalvarEmDiretorioCorreto() throws IOException {
        when(fileMock.getOriginalFilename()).thenReturn("document.txt");
        when(fileMock.getInputStream()).thenReturn(new ByteArrayInputStream("teste".getBytes()));

        String resultado = service.salvar(fileMock);
        Path uploadsDir = Paths.get("uploads").toAbsolutePath().normalize();

        // Extrair o nome do arquivo da URL retornada
        String nomeArquivo = resultado.substring(resultado.lastIndexOf("/") + 1);
        Path caminhoArquivo = uploadsDir.resolve(nomeArquivo);

        assertTrue(Files.exists(caminhoArquivo));
    }
}
