import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, FileText, Clock, Mic, Image, Video, Volume2, VolumeX, Lock, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const TIPO_LABELS = {
  RECLAMACAO: 'Reclamacao',
  DENUNCIA: 'Denuncia',
  SUGESTAO: 'Sugestao',
  ELOGIO: 'Elogio',
};

const STATUS_CONFIG = {
  RECEBIDO: { label: 'Recebido', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  EM_ANALISE: { label: 'Em Analise', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  ENCAMINHADO: { label: 'Encaminhado', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  CONCLUIDO: { label: 'Concluido', color: 'bg-green-100 text-green-800 border-green-300' },
};

export default function ConsultaProtocolo() {
  const [protocolo, setProtocolo] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [falando, setFalando] = useState(false);

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!protocolo.trim() || !senha.trim()) return;

    setLoading(true);
    setError(null);
    setResultado(null);
    pararFala();

    try {
      const response = await api.get(`/manifestacoes/${protocolo.trim()}`, {
        params: { senha: senha.trim() }
      });
      setResultado(response.data);
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Senha incorreta ou protocolo invalido. Verifique os dados e tente novamente.');
      } else if (err.response?.status === 404) {
        setError('Protocolo nao encontrado. Verifique o numero e tente novamente.');
      } else {
        setError('Erro ao consultar protocolo. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  const ouvirStatus = async () => {
    if (!('speechSynthesis' in window)) {
      setError('Seu navegador nao suporta sintese de voz.');
      return;
    }

    pararFala();

    try {
      const response = await api.get(`/manifestacoes/${protocolo.trim()}/status-voz`, {
        params: { senha: senha.trim() }
      });
      const texto = response.data.resumoAcessivel;

      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.onstart = () => setFalando(true);
      utterance.onend = () => setFalando(false);
      utterance.onerror = () => setFalando(false);

      window.speechSynthesis.speak(utterance);
    } catch {
      setError('Erro ao buscar status por voz.');
    }
  };

  const pararFala = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setFalando(false);
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return '--';
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const dados = resultado?.dados;
  const statusInfo = dados ? STATUS_CONFIG[dados.status] || { label: dados.status, color: 'bg-gray-100 text-gray-800 border-gray-300' } : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Formulario de busca */}
      <form onSubmit={handleBuscar} className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Consultar Protocolo</h2>
        <p className="text-sm text-gray-500 mb-4">
          Informe o numero do protocolo e a senha recebidos ao registrar sua manifestacao.
        </p>

        <div className="space-y-3">
          <div>
            <label htmlFor="protocolo" className="block text-sm font-medium text-gray-700 mb-1">
              Numero do Protocolo
            </label>
            <input
              type="text"
              id="protocolo"
              value={protocolo}
              onChange={(e) => setProtocolo(e.target.value.toUpperCase())}
              placeholder="Ex: PROT-2026123456"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:border-transparent font-mono"
              aria-describedby="protocolo-hint"
            />
            <p id="protocolo-hint" className="text-xs text-gray-600 mt-1">
              Formato: PROT-AAAA000000
            </p>
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                type="password"
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha de 4 digitos"
                maxLength={4}
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:border-transparent font-mono tracking-widest"
                aria-describedby="senha-hint"
              />
            </div>
            <p id="senha-hint" className="text-xs text-gray-600 mt-1">
              Senha de 4 digitos recebida ao registrar a manifestacao
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !protocolo.trim() || !senha.trim()}
            className="w-full bg-gov-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-gov-dark transition-colors focus:ring-4 focus:ring-blue-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            {loading ? 'Buscando...' : 'Buscar Manifestacao'}
          </button>
        </div>
      </form>

      {/* Erro */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center gap-2" role="alert">
          <AlertCircle size={20} aria-hidden="true" />
          {error}
        </div>
      )}

      {/* Resultado */}
      {dados && (
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100" role="region" aria-label="Detalhes da manifestacao" aria-live="polite">
          {/* Cabecalho com protocolo e status */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <FileText size={24} className="text-gov-blue" aria-hidden="true" />
              <div>
                <h3 className="font-bold text-gray-800">Manifestacao {dados.protocolo}</h3>
                <p className="text-sm text-gray-500">
                  {TIPO_LABELS[dados.tipo] || dados.tipo}
                </p>
              </div>
            </div>
            {statusInfo && (
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusInfo.color}`} role="status">
                {statusInfo.label}
              </span>
            )}
          </div>

          {/* Barra de status visual */}
          <div className="mb-6">
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">Progresso do Protocolo</p>
            <div className="flex items-center gap-1">
              {Object.entries(STATUS_CONFIG).map(([key, config], idx) => {
                const statusKeys = Object.keys(STATUS_CONFIG);
                const currentIdx = statusKeys.indexOf(dados.status);
                const isActive = idx <= currentIdx;
                return (
                  <div key={key} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`h-2 w-full rounded-full transition-colors ${isActive ? 'bg-gov-blue' : 'bg-gray-200'}`}
                      aria-hidden="true"
                    />
                    <span className={`text-[10px] ${isActive ? 'text-gov-blue font-semibold' : 'text-gray-500'}`}>
                      {config.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Botao de ouvir status */}
          <button
            type="button"
            onClick={falando ? pararFala : ouvirStatus}
            className={`w-full mb-4 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors focus:ring-4 focus:ring-blue-300 ${
              falando
                ? 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200'
                : 'bg-blue-50 text-gov-blue border border-blue-200 hover:bg-blue-100'
            }`}
            aria-label={falando ? 'Parar leitura do status' : 'Ouvir status da manifestacao'}
          >
            {falando ? <VolumeX size={20} /> : <Volume2 size={20} />}
            {falando ? 'Parar Leitura' : 'Ouvir Status por Voz'}
          </button>

          <dl className="space-y-3">
            {dados.descricao && (
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase">Descricao</dt>
                <dd className="mt-1 text-gray-700 bg-gray-50 p-3 rounded-lg">{dados.descricao}</dd>
              </div>
            )}
            {!dados.descricao && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                Manifestacao registrada por midia (audio, imagem ou video).
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase">Data de Criacao</dt>
                <dd className="mt-1 text-gray-700 flex items-center gap-1">
                  <Clock size={14} aria-hidden="true" />
                  {formatarData(dados.dataCriacao)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase">Identificacao</dt>
                <dd className="mt-1 text-gray-700">
                  {dados.anonimo ? 'Anonimo' : dados.nomeCidadao || '--'}
                </dd>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase">Prioridade</dt>
                <dd className="mt-1">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    dados.prioridade === 'ALTA' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {dados.prioridade || 'NORMAL'}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase">Status Atual</dt>
                <dd className="mt-1">
                  <span className={`px-2 py-1 rounded text-xs font-semibold border ${statusInfo?.color || ''}`}>
                    {statusInfo?.label || dados.status}
                  </span>
                </dd>
              </div>
            </div>

            {/* Anexos */}
            {(dados.anexoAudioUrl || dados.anexoImagemUrl || dados.anexoVideoUrl) && (
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase mb-2">Anexos</dt>
                <dd className="space-y-3">
                  {dados.anexoImagemUrl && (
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      <p className="text-sm font-medium text-gray-600 px-3 py-2 bg-green-50 flex items-center gap-1">
                        <Image size={14} aria-hidden="true" /> Imagem
                      </p>
                      <img
                        src={dados.anexoImagemUrl}
                        alt="Imagem anexada a manifestacao"
                        className="w-full max-h-96 object-contain bg-gray-100"
                      />
                    </div>
                  )}
                  {dados.anexoAudioUrl && (
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      <p className="text-sm font-medium text-gray-600 px-3 py-2 bg-blue-50 flex items-center gap-1">
                        <Mic size={14} aria-hidden="true" /> Audio
                      </p>
                      <div className="p-3">
                        <audio controls src={dados.anexoAudioUrl} className="w-full" aria-label="Audio anexado">
                          Seu navegador nao suporta audio.
                        </audio>
                      </div>
                    </div>
                  )}
                  {dados.anexoVideoUrl && (
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      <p className="text-sm font-medium text-gray-600 px-3 py-2 bg-purple-50 flex items-center gap-1">
                        <Video size={14} aria-hidden="true" /> Video
                      </p>
                      <video controls src={dados.anexoVideoUrl} className="w-full max-h-96 bg-black" aria-label="Video anexado">
                        Seu navegador nao suporta video.
                      </video>
                    </div>
                  )}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}
