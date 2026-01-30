import React, { useState, useEffect } from 'react';
import { BarChart3, AlertTriangle, Mic, FileText, Loader2, Volume2, VolumeX, TrendingUp, PieChart } from 'lucide-react';
import api from '../services/api';

const STATUS_LABELS = {
  RECEBIDO: 'Recebido',
  EM_ANALISE: 'Em Analise',
  ENCAMINHADO: 'Encaminhado',
  CONCLUIDO: 'Concluido',
};

const TIPO_LABELS = {
  RECLAMACAO: 'Reclamacao',
  DENUNCIA: 'Denuncia',
  SUGESTAO: 'Sugestao',
  ELOGIO: 'Elogio',
};

const STATUS_COLORS = {
  RECEBIDO: 'bg-blue-500',
  EM_ANALISE: 'bg-yellow-500',
  ENCAMINHADO: 'bg-orange-500',
  CONCLUIDO: 'bg-green-500',
};

const TIPO_COLORS = {
  RECLAMACAO: 'bg-red-500',
  DENUNCIA: 'bg-purple-500',
  SUGESTAO: 'bg-cyan-500',
  ELOGIO: 'bg-emerald-500',
};

export default function Dashboard() {
  const [dashData, setDashData] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [falando, setFalando] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, kpisRes] = await Promise.all([
        api.get('/dashboard/completo'),
        api.get('/dashboard/kpis'),
      ]);
      setDashData(dashRes.data);
      setKpis(kpisRes.data);
    } catch {
      setError('Erro ao carregar dados do dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const ouvirResumo = () => {
    if (!('speechSynthesis' in window) || !dashData?.resumoVoz) return;

    if (falando) {
      window.speechSynthesis.cancel();
      setFalando(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(dashData.resumoVoz);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.onstart = () => setFalando(true);
    utterance.onend = () => setFalando(false);
    utterance.onerror = () => setFalando(false);
    window.speechSynthesis.speak(utterance);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-gov-blue" size={40} />
        <span className="ml-3 text-gray-600 text-lg">Carregando dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-red-50 text-red-700 rounded-lg border border-red-200 text-center">
        <p>{error}</p>
        <button onClick={carregarDados} className="mt-3 text-sm underline hover:no-underline">
          Tentar novamente
        </button>
      </div>
    );
  }

  const maxStatus = dashData?.distribuicaoStatus
    ? Math.max(...dashData.distribuicaoStatus.map(([, count]) => count), 1)
    : 1;
  const maxTipo = dashData?.distribuicaoTipo
    ? Math.max(...dashData.distribuicaoTipo.map(([, count]) => count), 1)
    : 1;

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Botao de acessibilidade - Ouvir resumo */}
      <button
        type="button"
        onClick={ouvirResumo}
        className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors focus:ring-4 focus:ring-blue-300 ${
          falando
            ? 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200'
            : 'bg-blue-50 text-gov-blue border border-blue-200 hover:bg-blue-100'
        }`}
        aria-label={falando ? 'Parar leitura do resumo' : 'Ouvir resumo do dashboard por voz'}
      >
        {falando ? <VolumeX size={20} /> : <Volume2 size={20} />}
        {falando ? 'Parar Leitura' : 'Ouvir Resumo por Voz'}
      </button>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
          <FileText size={28} className="text-gov-blue mx-auto mb-2" aria-hidden="true" />
          <p className="text-3xl font-bold text-gray-800">{kpis?.total ?? 0}</p>
          <p className="text-sm text-gray-500 mt-1">Total de Manifestacoes</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
          <AlertTriangle size={28} className="text-red-500 mx-auto mb-2" aria-hidden="true" />
          <p className="text-3xl font-bold text-red-600">{kpis?.urgencia ?? '0%'}</p>
          <p className="text-sm text-gray-500 mt-1">Indice de Urgencia</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
          <Mic size={28} className="text-green-500 mx-auto mb-2" aria-hidden="true" />
          <p className="text-3xl font-bold text-green-600">{kpis?.acessibilidade ?? '0%'}</p>
          <p className="text-sm text-gray-500 mt-1">Taxa de Acessibilidade</p>
        </div>
      </div>

      {/* Distribuicao por Status e Tipo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Por Status */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-gov-blue" aria-hidden="true" />
            Distribuicao por Status
          </h3>
          <div className="space-y-3">
            {dashData?.distribuicaoStatus?.map(([status, count]) => (
              <div key={status}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">{STATUS_LABELS[status] || status}</span>
                  <span className="text-gray-500 font-mono">{count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${STATUS_COLORS[status] || 'bg-gray-400'}`}
                    style={{ width: `${(count / maxStatus) * 100}%` }}
                    role="progressbar"
                    aria-valuenow={count}
                    aria-valuemax={maxStatus}
                    aria-label={`${STATUS_LABELS[status] || status}: ${count}`}
                  />
                </div>
              </div>
            ))}
            {(!dashData?.distribuicaoStatus || dashData.distribuicaoStatus.length === 0) && (
              <p className="text-gray-400 text-sm text-center py-4">Nenhum dado disponivel</p>
            )}
          </div>
        </div>

        {/* Por Tipo */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <PieChart size={20} className="text-gov-blue" aria-hidden="true" />
            Distribuicao por Tipo
          </h3>
          <div className="space-y-3">
            {dashData?.distribuicaoTipo?.map(([tipo, count]) => (
              <div key={tipo}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">{TIPO_LABELS[tipo] || tipo}</span>
                  <span className="text-gray-500 font-mono">{count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${TIPO_COLORS[tipo] || 'bg-gray-400'}`}
                    style={{ width: `${(count / maxTipo) * 100}%` }}
                    role="progressbar"
                    aria-valuenow={count}
                    aria-valuemax={maxTipo}
                    aria-label={`${TIPO_LABELS[tipo] || tipo}: ${count}`}
                  />
                </div>
              </div>
            ))}
            {(!dashData?.distribuicaoTipo || dashData.distribuicaoTipo.length === 0) && (
              <p className="text-gray-400 text-sm text-center py-4">Nenhum dado disponivel</p>
            )}
          </div>
        </div>
      </div>

      {/* Uso de Midias */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-gov-blue" aria-hidden="true" />
          Uso de Midias
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <Mic size={24} className="text-blue-600 mx-auto mb-2" aria-hidden="true" />
            <p className="text-2xl font-bold text-blue-700">{dashData?.usoMidias?.audio ?? 0}</p>
            <p className="text-xs text-blue-600 mt-1">Audio</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <span className="block text-green-600 mx-auto mb-2 text-center" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </span>
            <p className="text-2xl font-bold text-green-700">{dashData?.usoMidias?.imagem ?? 0}</p>
            <p className="text-xs text-green-600 mt-1">Imagem</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <span className="block text-purple-600 mx-auto mb-2 text-center" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>
            </span>
            <p className="text-2xl font-bold text-purple-700">{dashData?.usoMidias?.video ?? 0}</p>
            <p className="text-xs text-purple-600 mt-1">Video</p>
          </div>
        </div>
      </div>
    </div>
  );
}
