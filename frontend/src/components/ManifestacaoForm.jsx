import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import api from '../services/api';
import AudioRecorder from './AudioRecorder';
import MediaUpload from './MediaUpload';

const TIPOS = [
  { value: 'RECLAMACAO', label: 'Reclamação' },
  { value: 'DENUNCIA', label: 'Denúncia' },
  { value: 'SUGESTAO', label: 'Sugestão' },
  { value: 'ELOGIO', label: 'Elogio' },
];

export default function ManifestacaoForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      if (audioBlob) {
        data.append('audio', audioBlob, 'audio.webm');
      }
      if (imagem) {
        data.append('imagem', imagem);
      }
      if (video) {
        data.append('video', video);
      }

      const response = await api.post('/manifestacoes', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(`Manifestação registrada com sucesso! Protocolo: ${response.data.protocolo}`);
      // Reset form
      setFormData({
        descricao: '',
        tipo: 'RECLAMACAO',
        anonimo: false,
        nome: '',
        email: '',
      });
      setAudioBlob(null);
      setImagem(null);
      setVideo(null);
      
      // Force reload audio recorder somehow or just let specific component handle reset via key or prop? 
      // AudioRecorder has internal state. Better to remount it or expose reset.
      // Simple way: Key change.
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao enviar sua manifestação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      
      <div className="space-y-4">
        <div>
          <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Manifestação</label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:border-transparent bg-white"
          >
            {TIPOS.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
           <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
           <textarea
             id="descricao"
             name="descricao"
             rows={4}
             value={formData.descricao}
             onChange={handleChange}
             required
             placeholder="Descreva detalhadamente sua manifestação..."
             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:border-transparent"
           />
        </div>

        <div className="flex items-center gap-2 py-2">
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

        {!formData.anonimo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required={!formData.anonimo}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required={!formData.anonimo}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:border-transparent"
              />
            </div>
          </div>
        )}

        <hr className="border-gray-200" />
        
        <h3 className="font-semibold text-gray-800">Anexos (Opcional)</h3>
        
        <AudioRecorder key={success ? 'reset-audio' : 'audio'} onRecordingComplete={setAudioBlob} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MediaUpload key={success ? 'reset-img' : 'img'} type="image" label="Foto" onMediaSelect={setImagem} />
            <MediaUpload key={success ? 'reset-vid' : 'vid'} type="video" label="Vídeo" onMediaSelect={setVideo} />
        </div>

      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200" role="alert">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gov-blue text-white font-bold py-4 rounded-lg hover:bg-gov-dark transition-colors focus:ring-4 focus:ring-blue-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
        {loading ? 'Enviando...' : 'Enviar Manifestação'}
      </button>

    </form>
  );
}
