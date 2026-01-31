package br.com.cg.ouvidoria.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.multipart.MultipartFile;

import br.com.cg.ouvidoria.constants.ProtocoloStatusEnum;
import br.com.cg.ouvidoria.constants.TipoManifestacaoEnum;
import br.com.cg.ouvidoria.model.entity.Manifestacao;
import br.com.cg.ouvidoria.repository.ManifestacaoRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("Testes da ManifestacaoService")
class ManifestacaoServiceTest {

    @Mock
    private ManifestacaoRepository repository;

    @Mock
    private AnaliseTextoService analiseTextoService;

    @Mock
    private FileService fileService;

    @InjectMocks
    private ManifestacaoService service;

    private Manifestacao manifestacao;
    private MultipartFile audioMock;
    private MultipartFile imagemMock;
    private MultipartFile videoMock;

    @BeforeEach
    void setUp() {
        manifestacao = new Manifestacao();
        manifestacao.setId(1L);
        manifestacao.setTipo(TipoManifestacaoEnum.RECLAMACAO);
        manifestacao.setDescricao("Testando serviço de manifestação");
        manifestacao.setNomeCidadao("João Silva");
        manifestacao.setEmailCidadao("joao@test.com");
        manifestacao.setDataCriacao(LocalDateTime.now());

        audioMock = mock(MultipartFile.class);
        imagemMock = mock(MultipartFile.class);
        videoMock = mock(MultipartFile.class);
    }

    @Test
    @DisplayName("Deve salvar manifestação simples com sucesso")
    void testSalvarSimples() {
        when(repository.save(manifestacao)).thenReturn(manifestacao);

        Manifestacao resultado = service.salvarSimples(manifestacao);

        assertNotNull(resultado);
        assertEquals(manifestacao.getId(), resultado.getId());
        verify(repository, times(1)).save(manifestacao);
    }

    @Test
    @DisplayName("Deve buscar manifestação por protocolo")
    void testBuscarPorProtocolo() {
        String protocolo = "PROT-20261234567";
        manifestacao.setProtocolo(protocolo);

        when(repository.findByProtocolo(protocolo)).thenReturn(Optional.of(manifestacao));

        Optional<Manifestacao> resultado = service.buscarPorProtocolo(protocolo);

        assertTrue(resultado.isPresent());
        assertEquals(protocolo, resultado.get().getProtocolo());
        verify(repository, times(1)).findByProtocolo(protocolo);
    }

    @Test
    @DisplayName("Deve retornar vazio ao buscar protocolo inexistente")
    void testBuscarPorProtocoloInexistente() {
        String protocolo = "PROT-INEXISTENTE";

        when(repository.findByProtocolo(protocolo)).thenReturn(Optional.empty());

        Optional<Manifestacao> resultado = service.buscarPorProtocolo(protocolo);

        assertFalse(resultado.isPresent());
        verify(repository, times(1)).findByProtocolo(protocolo);
    }

    @Test
    @DisplayName("Deve salvar manifestação com arquivos de mídia")
    void testSalvarManifestacaoComArquivos() {
        when(analiseTextoService.calcularCriticidade(anyString())).thenReturn("ALTA");
        when(fileService.salvar(audioMock)).thenReturn("url_audio");
        when(fileService.salvar(imagemMock)).thenReturn("url_imagem");
        when(fileService.salvar(videoMock)).thenReturn("url_video");
        when(repository.save(any(Manifestacao.class))).thenAnswer(invocation -> {
            Manifestacao m = invocation.getArgument(0);
            m.setId(1L);
            return m;
        });

        when(audioMock.isEmpty()).thenReturn(false);
        when(imagemMock.isEmpty()).thenReturn(false);
        when(videoMock.isEmpty()).thenReturn(false);

        Manifestacao resultado = service.salvarManifestacaoComArquivos(manifestacao, audioMock, imagemMock, videoMock);

        assertNotNull(resultado);
        assertNotNull(resultado.getProtocolo());
        assertTrue(resultado.getProtocolo().startsWith("PROT-"));
        assertEquals(ProtocoloStatusEnum.RECEBIDO, resultado.getStatus());
        assertEquals("url_audio", resultado.getAnexoAudioUrl());
        assertEquals("url_imagem", resultado.getAnexoImagemUrl());
        assertEquals("url_video", resultado.getAnexoVideoUrl());
        verify(repository, times(1)).save(any(Manifestacao.class));
    }

    @Test
    @DisplayName("Deve salvar manifestação com apenas áudio")
    void testSalvarManifestacaoApenasAudio() {
        when(analiseTextoService.calcularCriticidade(anyString())).thenReturn("ALTA");
        when(fileService.salvar(audioMock)).thenReturn("url_audio");
        when(repository.save(any(Manifestacao.class))).thenAnswer(invocation -> {
            Manifestacao m = invocation.getArgument(0);
            m.setId(1L);
            return m;
        });

        when(audioMock.isEmpty()).thenReturn(false);
        when(imagemMock.isEmpty()).thenReturn(true);
        when(videoMock.isEmpty()).thenReturn(true);

        Manifestacao resultado = service.salvarManifestacaoComArquivos(manifestacao, audioMock, imagemMock, videoMock);

        assertNotNull(resultado);
        assertEquals("url_audio", resultado.getAnexoAudioUrl());
        assertNull(resultado.getAnexoImagemUrl());
        assertNull(resultado.getAnexoVideoUrl());
    }

    @Test
    @DisplayName("Deve gerar protocolo com formato correto")
    void testGerarProtocolo() {
        when(analiseTextoService.calcularCriticidade(anyString())).thenReturn("ALTA");
        when(repository.save(any(Manifestacao.class))).thenAnswer(invocation -> {
            Manifestacao m = invocation.getArgument(0);
            m.setId(1L);
            return m;
        });

        Manifestacao resultado = service.salvarManifestacaoComArquivos(manifestacao, null, null, null);

        assertNotNull(resultado.getProtocolo());
        assertTrue(resultado.getProtocolo().matches("PROT-20\\d{8}"));
    }

    @Test
    @DisplayName("Deve gerar senha aleatória com 4 dígitos")
    void testGerarSenha() {
        when(analiseTextoService.calcularCriticidade(anyString())).thenReturn("ALTA");
        when(repository.save(any(Manifestacao.class))).thenAnswer(invocation -> {
            Manifestacao m = invocation.getArgument(0);
            m.setId(1L);
            return m;
        });

        Manifestacao resultado = service.salvarManifestacaoComArquivos(manifestacao, null, null, null);

        assertNotNull(resultado.getSenha());
        assertTrue(resultado.getSenha().matches("\\d{4}"));
    }

    @Test
    @DisplayName("Deve gerar resumo acessível com as informações corretas")
    void testGerarResumoAcessivel() {
        manifestacao.setProtocolo("PROT-20261234567");
        manifestacao.setStatus(ProtocoloStatusEnum.RECEBIDO);
        manifestacao.setTipo(TipoManifestacaoEnum.RECLAMACAO);
        manifestacao.setDataCriacao(LocalDateTime.now());

        String resumo = service.gerarResumoAcessivel(manifestacao);

        assertNotNull(resumo);
        assertTrue(resumo.contains("reclamacao"));
        assertTrue(resumo.contains("PROT-20261234567"));
        assertTrue(resumo.contains("RECEBIDO"));
    }

    @Test
    @DisplayName("Deve validar senha correta com sucesso")
    void testBuscarPorProtocoloESenhaCorreta() {
        String protocolo = "PROT-20261234567";
        String senhaPlana = "1234";
        manifestacao.setProtocolo(protocolo);
        manifestacao.setSenha(new BCryptPasswordEncoder().encode(senhaPlana));

        when(repository.findByProtocolo(protocolo)).thenReturn(Optional.of(manifestacao));

        Optional<Manifestacao> resultado = service.buscarPorProtocoloESenha(protocolo, senhaPlana);

        assertTrue(resultado.isPresent());
        verify(repository, times(1)).findByProtocolo(protocolo);
    }

    @Test
    @DisplayName("Deve rejeitar senha incorreta")
    void testBuscarPorProtocoloESenhaIncorreta() {
        String protocolo = "PROT-20261234567";
        String senhaCorreta = "1234";
        String senhaIncorreta = "5678";
        manifestacao.setProtocolo(protocolo);
        manifestacao.setSenha(new BCryptPasswordEncoder().encode(senhaCorreta));

        when(repository.findByProtocolo(protocolo)).thenReturn(Optional.of(manifestacao));

        Optional<Manifestacao> resultado = service.buscarPorProtocoloESenha(protocolo, senhaIncorreta);

        assertFalse(resultado.isPresent());
    }
}
