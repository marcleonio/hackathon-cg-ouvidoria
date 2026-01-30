-- 1. Denúncia crítica com áudio (Urgente)
INSERT INTO manifestacao (protocolo, senha, status, prioridade, tipo, descricao, anonimo, anexo_audio_url, data_criacao)
VALUES ('20260130001', '1234', 'RECEBIDO', 'ALTA', 'DENUNCIA', 'Existe um risco grave de desabamento na encosta da vila sul devido às chuvas, perigo imediato.', true, 'uploads/audio1.mp3', CURRENT_TIMESTAMP);

-- 2. Reclamação normal com imagem
INSERT INTO manifestacao (protocolo, senha, status, prioridade, tipo, descricao, anonimo, nome_cidadao, email_cidadao, anexo_imagem_url, data_criacao)
VALUES ('20260130002', '1234', 'EM_ANALISE', 'NORMAL', 'RECLAMACAO', 'Luz do poste da rua 10 está queimada há três dias.', false, 'João Silva', 'joao@email.com', 'uploads/imagem1.jpg', CURRENT_TIMESTAMP);

-- 3. Sugestão normal (Sem anexos)
INSERT INTO manifestacao (protocolo, senha, status, prioridade, tipo, descricao, anonimo, nome_cidadao, email_cidadao, data_criacao)
VALUES ('20260130003', '1234', 'RECEBIDO', 'NORMAL', 'SUGESTAO', 'Sugiro a implementação de uma ciclofaixa na avenida principal.', false, 'Maria Souza', 'maria@email.com', CURRENT_TIMESTAMP);

-- 4. Denúncia com vídeo (Urgente)
INSERT INTO manifestacao (protocolo, senha, status, prioridade, tipo, descricao, anonimo, anexo_video_url, data_criacao)
VALUES ('20260130004', '1234', 'RECEBIDO', 'ALTA', 'DENUNCIA', 'Flagrante de descarte irregular de lixo hospitalar, situação de emergência sanitária.', true, 'uploads/video1.mp4', CURRENT_TIMESTAMP);

-- 5. Elogio (Finalizado)
INSERT INTO manifestacao (protocolo, senha, status, prioridade, tipo, descricao, anonimo, nome_cidadao, data_criacao)
VALUES ('20260130005', '1234', 'CONCLUIDO', 'NORMAL', 'ELOGIO', 'Excelente atendimento na UBS do Setor O, médicos muito atenciosos.', false, 'Ricardo Lima', CURRENT_TIMESTAMP);

-- 6. Denúncia crítica com áudio e imagem
INSERT INTO manifestacao (protocolo, senha, status, prioridade, tipo, descricao, anonimo, anexo_audio_url, anexo_imagem_url, data_criacao)
VALUES ('20260130006', '1234', 'EM_ANALISE', 'ALTA', 'DENUNCIA', 'Vazamento de gás detectado perto da escola municipal, risco de explosão grave.', true, 'uploads/audio2.mp3', 'uploads/imagem2.jpg', CURRENT_TIMESTAMP);

-- 7. Reclamação com vídeo
INSERT INTO manifestacao (protocolo, senha, status, prioridade, tipo, descricao, anonimo, nome_cidadao, anexo_video_url, data_criacao)
VALUES ('20260130007', '1234', 'RECEBIDO', 'NORMAL', 'RECLAMACAO', 'O ônibus da linha 110 não passou no horário estipulado novamente.', false, 'Ana Paula', 'uploads/video2.mp4', CURRENT_TIMESTAMP);

-- 8. Sugestão com imagem
INSERT INTO manifestacao (protocolo, senha, status, prioridade, tipo, descricao, anonimo, anexo_imagem_url, data_criacao)
VALUES ('20260130008', '1234', 'RECEBIDO', 'NORMAL', 'SUGESTAO', 'Poderiam colocar mais bancos nesta praça conforme a foto em anexo.', true, 'uploads/imagem3.jpg', CURRENT_TIMESTAMP);

-- 9. Denúncia urgente (Apenas texto)
INSERT INTO manifestacao (protocolo, senha, status, prioridade, tipo, descricao, anonimo, data_criacao)
VALUES ('20260130009', '1234', 'RECEBIDO', 'ALTA', 'DENUNCIA', 'Cano de água mestre estourou e está inundando as casas, situação urgente!', true, CURRENT_TIMESTAMP);

-- 10. Reclamação normal
INSERT INTO manifestacao (protocolo, senha, status, prioridade, tipo, descricao, anonimo, nome_cidadao, email_cidadao, data_criacao)
VALUES ('20260130010', '1234', 'CONCLUIDO', 'NORMAL', 'RECLAMACAO', 'Demora excessiva na fila do banco estatal.', false, 'Carlos Nobre', 'carlos@email.com', CURRENT_TIMESTAMP);