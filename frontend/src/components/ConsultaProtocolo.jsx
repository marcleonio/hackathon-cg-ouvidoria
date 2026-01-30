import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, FileText, Clock, Mic, Image, Video } from 'lucide-react';
import api from '../services/api';

const TIPO_LABELS = {
  RECLAMACAO: 'Reclamação',
  DENUNCIA: 'Denúncia',
  SUGESTAO: 'Sugestão',
  ELOGIO: 'Elogio',
};

export default function ConsultaProtocolo() {
  const [protocolo, setProtocolo] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!protocolo.trim()) return;

    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const response = await api.get(`/manifestacoes/${protocolo.trim()}`);
      setResultado(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Protocolo não encontrado. Verifique o número e tente novamente.');
      } else {
        setError('Erro ao consultar protocolo. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return '—';
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Formulário de busca */}
      <form onSubmit={handleBuscar} className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Consultar Protocolo</h2>
        <p className="text-sm text-gray-500 mb-4">
          Informe o número do protocolo recebido ao registrar sua manifestação.
        </p>

        <div className="flex gap-3">
          <div className="flex-1">
            <label htmlFor="protocolo" className="sr-only">Número do protocolo</label>
            <input
              type="text"
              id="protocolo"
              value={protocolo}
              onChange={(e) => setProtocolo(e.target.value.toUpperCase())}
              placeholder="Ex: PROT-2026123456"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:border-transparent font-mono"
              aria-describedby="protocolo-hint"
            />
            <p id="protocolo-hint" className="text-xs text-gray-400 mt-1">
              Formato: PROT-AAAA000000
            </p>
          </div>
          <button
            type="submit"
            disabled={loading || !protocolo.trim()}
            className="bg-gov-blue text-white font-bold px-6 rounded-lg hover:bg-gov-dark transition-colors focus:ring-4 focus:ring-blue-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed self-start h-12"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            <span className="hidden sm:inline">Buscar</span>
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
      {resultado && (
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100" role="region" aria-label="Detalhes da manifestação">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
            <FileText size={24} className="text-gov-blue" aria-hidden="true" />
            <div>
              <h3 className="font-bold text-gray-800">Manifestação {resultado.protocolo}</h3>
              <p className="text-sm text-gray-500">
                {TIPO_LABELS[resultado.tipo] || resultado.tipo}
              </p>
            </div>
          </div>

          <dl className="space-y-3">
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase">Descrição</dt>
              <dd className="mt-1 text-gray-700 bg-gray-50 p-3 rounded-lg">{resultado.descricao}</dd>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase">Data de Criação</dt>
                <dd className="mt-1 text-gray-700 flex items-center gap-1">
                  <Clock size={14} aria-hidden="true" />
                  {formatarData(resultado.dataCriacao)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase">Identificação</dt>
                <dd className="mt-1 text-gray-700">
                  {resultado.anonimo ? 'Anônimo' : resultado.nomeCidadao || '—'}
                </dd>
              </div>
            </div>

            {/* Anexos */}
            {(resultado.anexoAudioUrl || resultado.anexoImagemUrl || resultado.anexoVideoUrl) && (
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase mb-2">Anexos</dt>
                <dd className="space-y-3">
                  {resultado.anexoImagemUrl && (
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      <p className="text-sm font-medium text-gray-600 px-3 py-2 bg-green-50 flex items-center gap-1">
                        <Image size={14} aria-hidden="true" /> Imagem
                      </p>
                      <img
                        src={resultado.anexoImagemUrl}
                        alt="Imagem anexada à manifestação"
                        className="w-full max-h-96 object-contain bg-gray-100"
                      />
                    </div>
                  )}
                  {resultado.anexoAudioUrl && (
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      <p className="text-sm font-medium text-gray-600 px-3 py-2 bg-blue-50 flex items-center gap-1">
                        <Mic size={14} aria-hidden="true" /> Áudio
                      </p>
                      <div className="p-3">
                        <audio controls src={resultado.anexoAudioUrl} className="w-full" aria-label="Áudio anexado">
                          Seu navegador não suporta áudio.
                        </audio>
                      </div>
                    </div>
                  )}
                  {resultado.anexoVideoUrl && (
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      <p className="text-sm font-medium text-gray-600 px-3 py-2 bg-purple-50 flex items-center gap-1">
                        <Video size={14} aria-hidden="true" /> Vídeo
                      </p>
                      <video controls src={resultado.anexoVideoUrl} className="w-full max-h-96 bg-black" aria-label="Vídeo anexado">
                        Seu navegador não suporta vídeo.
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
