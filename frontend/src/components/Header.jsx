import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  Eye, EyeOff, Megaphone, BarChart3, HelpCircle,
  Volume2, VolumeX, Minus, Plus, Sun, Moon,
} from 'lucide-react';

export default function Header() {
  const {
    highContrast,
    toggleHighContrast,
    fontSizeLabel,
    increaseFontSize,
    decreaseFontSize,
    canIncrease,
    canDecrease,
  } = useAccessibility();

  const [openPanel, setOpenPanel] = useState(null);
  const [falando, setFalando] = useState(false);
  const barRef = useRef(null);

  // Fecha painel ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) {
        setOpenPanel(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fecha painel com Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setOpenPanel(null);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const togglePanel = (panel) => {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  };

  // Speech Synthesis — ler conteudo principal
  const lerPagina = () => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const main = document.getElementById('conteudo-principal');
    if (!main) return;

    const texto = main.innerText;
    if (!texto.trim()) return;

    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.onstart = () => setFalando(true);
    utterance.onend = () => setFalando(false);
    utterance.onerror = () => setFalando(false);

    window.speechSynthesis.speak(utterance);
  };

  const pararLeitura = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setFalando(false);
  };

  const btnBase =
    'relative flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300';

  return (
    <>
      {/* Barra de acessibilidade */}
      <nav
        ref={barRef}
        aria-label="Barra de acessibilidade"
        className="bg-gov-dark text-white text-xs py-1.5 px-4 relative z-[60]"
      >
        <div className="container mx-auto flex justify-between items-center">
          <a
            href="#conteudo-principal"
            className="underline focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded px-1"
          >
            Ir para o conteudo principal
          </a>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline opacity-80 mr-1">Acessibilidade:</span>

            {/* Botao Visual (Olho) */}
            <button
              onClick={() => togglePanel('visual')}
              className={`${btnBase} ${openPanel === 'visual' ? 'bg-white/20' : 'hover:bg-white/10'}`}
              aria-expanded={openPanel === 'visual'}
              aria-controls="panel-visual"
              aria-label="Ferramentas de acessibilidade visual"
              title="Acessibilidade visual"
            >
              <EyeOff size={16} />
              <span className="hidden sm:inline">Visual</span>
            </button>

            {/* Botao Voz (Volume) */}
            <button
              onClick={() => togglePanel('voice')}
              className={`${btnBase} ${openPanel === 'voice' ? 'bg-white/20' : 'hover:bg-white/10'}`}
              aria-expanded={openPanel === 'voice'}
              aria-controls="panel-voice"
              aria-label="Ferramentas de acessibilidade por voz"
              title="Acessibilidade por voz"
            >
              <Volume2 size={16} />
              <span className="hidden sm:inline">Voz</span>
            </button>
          </div>
        </div>

        {/* Painel Visual */}
        {openPanel === 'visual' && (
          <div
            id="panel-visual"
            role="region"
            aria-label="Opcoes de acessibilidade visual"
            className="absolute right-4 top-full mt-1 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 p-4 w-72 animate-fade-in z-[70]"
          >
            <p className="text-xs font-bold uppercase text-gray-500 mb-3 tracking-wide">
              Acessibilidade Visual
            </p>

            {/* Tamanho da fonte */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Tamanho da Fonte
              </label>
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 border border-gray-200">
                <button
                  onClick={decreaseFontSize}
                  disabled={!canDecrease}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gov-blue"
                  aria-label="Diminuir fonte"
                >
                  <Minus size={16} />
                </button>
                <span className="text-sm font-bold text-gov-blue min-w-[3rem] text-center" aria-live="polite">
                  {fontSizeLabel}
                </span>
                <button
                  onClick={increaseFontSize}
                  disabled={!canIncrease}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gov-blue"
                  aria-label="Aumentar fonte"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Alto contraste */}
            <button
              onClick={toggleHighContrast}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-gov-blue ${
                highContrast
                  ? 'bg-yellow-100 border-yellow-400 text-yellow-900'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
              aria-pressed={highContrast}
            >
              {highContrast ? <Moon size={18} /> : <Sun size={18} />}
              <div className="text-left">
                <p className="text-sm font-semibold">
                  {highContrast ? 'Contraste Padrao' : 'Alto Contraste'}
                </p>
                <p className="text-[11px] opacity-70">
                  {highContrast ? 'Voltar ao tema normal' : 'Fundo preto com texto amarelo'}
                </p>
              </div>
            </button>
          </div>
        )}

        {/* Painel Voz */}
        {openPanel === 'voice' && (
          <div
            id="panel-voice"
            role="region"
            aria-label="Opcoes de acessibilidade por voz"
            className="absolute right-4 top-full mt-1 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 p-4 w-72 animate-fade-in z-[70]"
          >
            <p className="text-xs font-bold uppercase text-gray-500 mb-3 tracking-wide">
              Acessibilidade por Voz
            </p>

            {!falando ? (
              <button
                onClick={lerPagina}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gov-blue"
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100">
                  <Volume2 size={18} className="text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">Ler Pagina em Voz Alta</p>
                  <p className="text-[11px] opacity-70">Leitura automatica do conteudo</p>
                </div>
              </button>
            ) : (
              <button
                onClick={pararLeitura}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 animate-pulse-slow"
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-red-100">
                  <VolumeX size={18} className="text-red-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">Parar Leitura</p>
                  <p className="text-[11px] opacity-70">Interromper a leitura em andamento</p>
                </div>
              </button>
            )}

            <p className="text-[11px] text-gray-500 mt-3 leading-relaxed">
              Utiliza sintese de voz do navegador em Portugues (pt-BR) para ler o conteudo da pagina atual.
            </p>
          </div>
        )}
      </nav>

      {/* Header principal */}
      <header className="bg-gov-blue text-white shadow-md p-4 sticky top-0 z-50" role="banner">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/" className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded-lg p-1">
            <div className="bg-white p-2 rounded-full text-gov-blue" aria-hidden="true">
              <Megaphone size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">Participa DF</h1>
              <p className="text-xs opacity-90">Ouvidoria Digital do Distrito Federal</p>
            </div>
          </a>

          <nav aria-label="Navegacao principal" className="flex items-center gap-4">
            <a
              href="/"
              className="text-sm font-medium px-3 py-2 rounded hover:bg-gov-dark transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300"
            >
              Nova Manifestacao
            </a>
            <a
              href="/consulta"
              className="text-sm font-medium px-3 py-2 rounded hover:bg-gov-dark transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300"
            >
              Consultar Protocolo
            </a>
            <a
              href="/dashboard"
              className="text-sm font-medium px-3 py-2 rounded hover:bg-gov-dark transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 flex items-center gap-1"
            >
              <BarChart3 size={14} aria-hidden="true" />
              Dashboard
            </a>
            <a
              href="/orientacoes"
              className="text-sm font-medium px-3 py-2 rounded hover:bg-gov-dark transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 flex items-center gap-1"
            >
              <HelpCircle size={14} aria-hidden="true" />
              Orientacoes
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
