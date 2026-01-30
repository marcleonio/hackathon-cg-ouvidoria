import React, { useState, useRef } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle, FileText, User, Paperclip } from 'lucide-react';
import api from '../services/api';
import AudioRecorder from './AudioRecorder';
import MediaUpload from './MediaUpload';

const TIPOS = [
  { value: 'RECLAMACAO', label: 'Reclamação', desc: 'Insatisfação com serviço público' },
  { value: 'DENUNCIA', label: 'Denúncia', desc: 'Relato de irregularidade' },
  { value: 'SUGESTAO', label: 'Sugestão', desc: 'Proposta de melhoria' },
  { value: 'ELOGIO', label: 'Elogio', desc: 'Reconhecimento de bom atendimento' },
];

const STEPS = [
  { label: 'Tipo', icon: FileText },
  { label: 'Dados', icon: User },
  { label: 'Anexos', icon: Paperclip },
];

export default function ManifestacaoForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    descricao: '',
    tipo: 'RECLAMACAO',
    anonimo: false,
    nome: '',
    email: '',
  });

  const [audioBlob, setAudioBlob] = useState(null);
  const [imagem, setImagem] = useState(null);
  const [video, setVideo] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const canAdvanceStep = () => {
    if (currentStep === 0) {
      return formData.tipo && formData.descricao.trim().length > 0;
    }
    if (currentStep === 1) {
      if (formData.anonimo) return true;
      return formData.nome.trim().length > 0 && formData.email.trim().length > 0;
    }
    return true;
  };

  const [stepChangedAt, setStepChangedAt] = useState(0);

  const advanceStep = () => {
    if (canAdvanceStep()) {
      setCurrentStep(prev => prev + 1);
      setStepChangedAt(Date.now());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Evita submit acidental se o step acabou de mudar (double-click)
    if (Date.now() - stepChangedAt < 300) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = new FormData();
      data.append('descricao', formData.descricao);
      data.append('tipo', formData.tipo);
      data.append('anonimo', formData.anonimo);

      if (!formData.anonimo) {
        data.append('nome', formData.nome);
        data.append('email', formData.email);
      }

      if (audioBlob) data.append('audio', audioBlob, 'audio.webm');
      if (imagem) data.append('imagem', imagem);
      if (video) data.append('video', video);

      const response = await api.post('/manifestacoes', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess({ protocolo: response.data.protocolo, senha: response.data.senha });
      setFormData({ descricao: '', tipo: 'RECLAMACAO', anonimo: false, nome: '', email: '' });
      setAudioBlob(null);
      setImagem(null);
      setVideo(null);
      setCurrentStep(0);
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao enviar sua manifestação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Tela de sucesso com protocolo e senha
  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-green-200 text-center" role="status">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Manifestacao Registrada!</h3>
        <p className="text-gray-600 mb-6">Sua manifestacao foi recebida com sucesso.</p>
        <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Seu protocolo de acompanhamento:</p>
          <p className="text-2xl font-mono font-bold text-gov-blue tracking-wider">{success.protocolo}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-300">
          <p className="text-sm text-yellow-800 font-semibold mb-1">Sua senha de acesso:</p>
          <p className="text-3xl font-mono font-bold text-yellow-900 tracking-[0.3em]">{success.senha}</p>
          <p className="text-xs text-yellow-700 mt-2">
            Anote esta senha! Ela sera necessaria para consultar sua manifestacao.
          </p>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Guarde o protocolo e a senha para acompanhar o status da sua manifestacao.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setSuccess(null)}
            className="bg-gov-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-gov-dark transition-colors focus:ring-4 focus:ring-blue-300"
          >
            Nova Manifestacao
          </button>
          <a
            href="/consulta"
            className="bg-white text-gov-blue font-bold py-3 px-6 rounded-lg border-2 border-gov-blue hover:bg-blue-50 transition-colors focus:ring-4 focus:ring-blue-300 inline-block"
          >
            Consultar Protocolo
          </a>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">

      {/* Indicador de etapas */}
      <nav aria-label="Etapas do formulário" className="flex justify-center gap-2 mb-4">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === currentStep;
          const isCompleted = idx < currentStep;
          return (
            <button
              key={step.label}
              type="button"
              onClick={() => {
                if (idx < currentStep || canAdvanceStep()) setCurrentStep(idx);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gov-blue ${
                isActive
                  ? 'bg-gov-blue text-white'
                  : isCompleted
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
              }`}
              aria-current={isActive ? 'step' : undefined}
            >
              <Icon size={16} aria-hidden="true" />
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{idx + 1}</span>
            </button>
          );
        })}
      </nav>

      {/* Etapa 1 - Tipo e Descrição */}
      {currentStep === 0 && (
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-gray-800 mb-2">Tipo e Descrição</legend>

          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Manifestação <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:border-transparent bg-white"
              required
            >
              {TIPOS.map(t => (
                <option key={t.value} value={t.value}>{t.label} — {t.desc}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <textarea
              id="descricao"
              name="descricao"
              rows={5}
              value={formData.descricao}
              onChange={handleChange}
              required
              placeholder="Descreva detalhadamente sua manifestação..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:border-transparent resize-y"
              aria-describedby="descricao-hint"
            />
            <p id="descricao-hint" className="text-xs text-gray-500 mt-1">
              {formData.descricao.length}/2000 caracteres
            </p>
          </div>
        </fieldset>
      )}

      {/* Etapa 2 - Dados Pessoais */}
      {currentStep === 1 && (
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-gray-800 mb-2">Identificação</legend>

          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <input
              type="checkbox"
              id="anonimo"
              name="anonimo"
              checked={formData.anonimo}
              onChange={handleChange}
              className="w-5 h-5 text-gov-blue border-gray-300 rounded focus:ring-gov-blue"
            />
            <label htmlFor="anonimo" className="text-sm font-medium text-gray-700 cursor-pointer">
              Desejo manter o anonimato
            </label>
          </div>

          {formData.anonimo && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800" role="note">
              Sua manifestação será registrada de forma anônima. Você não será identificado.
            </div>
          )}

          {!formData.anonimo && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required={!formData.anonimo}
                  placeholder="Seu nome completo"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required={!formData.anonimo}
                  placeholder="seu@email.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:border-transparent"
                />
              </div>
            </div>
          )}
        </fieldset>
      )}

      {/* Etapa 3 - Anexos */}
      {currentStep === 2 && (
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-gray-800 mb-2">Anexos (Opcional)</legend>
          <p className="text-sm text-gray-500">
            Anexe arquivos para complementar sua manifestação. Áudio, imagem e vídeo são aceitos.
          </p>

          <AudioRecorder key={success ? 'reset-audio' : 'audio'} onRecordingComplete={setAudioBlob} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MediaUpload key={success ? 'reset-img' : 'img'} type="image" label="Foto" onMediaSelect={setImagem} />
            <MediaUpload key={success ? 'reset-vid' : 'vid'} type="video" label="Vídeo" onMediaSelect={setVideo} />
          </div>
        </fieldset>
      )}

      {/* Mensagem de erro */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center gap-2" role="alert">
          <AlertCircle size={20} aria-hidden="true" />
          {error}
        </div>
      )}

      {/* Navegação entre etapas */}
      <div className="flex justify-between gap-3">
        {currentStep > 0 && (
          <button
            type="button"
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:ring-4 focus:ring-blue-300"
          >
            Voltar
          </button>
        )}

        {currentStep < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={advanceStep}
            disabled={!canAdvanceStep()}
            className="ml-auto bg-gov-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-gov-dark transition-colors focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próximo
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="ml-auto bg-gov-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-gov-dark transition-colors focus:ring-4 focus:ring-blue-300 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            {loading ? 'Enviando...' : 'Enviar Manifestação'}
          </button>
        )}
      </div>
    </form>
  );
}
