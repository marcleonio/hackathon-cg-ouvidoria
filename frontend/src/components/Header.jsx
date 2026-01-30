import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Eye, Megaphone, Plus, Minus, BarChart3 } from 'lucide-react';

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

  return (
    <>
      {/* Barra de acessibilidade - padrão de sites governamentais */}
      <nav
        aria-label="Barra de acessibilidade"
        className="bg-gov-dark text-white text-xs py-1 px-4"
      >
        <div className="container mx-auto flex justify-between items-center">
          <a
            href="#conteudo-principal"
            className="underline focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded px-1"
          >
            Ir para o conteúdo principal
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">Acessibilidade:</span>
            <div className="flex items-center gap-1" role="group" aria-label="Controle de tamanho da fonte">
              <button
                onClick={decreaseFontSize}
                disabled={!canDecrease}
                className="p-1 rounded hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:opacity-40"
                aria-label="Diminuir tamanho da fonte"
                title="Diminuir fonte"
              >
                <span aria-hidden="true">A-</span>
              </button>
              <span className="text-[10px] opacity-70 w-8 text-center" aria-live="polite">
                {fontSizeLabel}
              </span>
              <button
                onClick={increaseFontSize}
                disabled={!canIncrease}
                className="p-1 rounded hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:opacity-40"
                aria-label="Aumentar tamanho da fonte"
                title="Aumentar fonte"
              >
                <span aria-hidden="true">A+</span>
              </button>
            </div>
            <button
              onClick={toggleHighContrast}
              className="flex items-center gap-1 p-1 rounded hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              aria-label={highContrast ? 'Desativar alto contraste' : 'Ativar alto contraste'}
              aria-pressed={highContrast}
              title={highContrast ? 'Desativar alto contraste' : 'Ativar alto contraste'}
            >
              <Eye size={14} />
              <span className="hidden sm:inline">
                {highContrast ? 'Contraste Padrão' : 'Alto Contraste'}
              </span>
            </button>
          </div>
        </div>
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

          <nav aria-label="Navegação principal" className="flex items-center gap-4">
            <a
              href="/"
              className="text-sm font-medium px-3 py-2 rounded hover:bg-gov-dark transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300"
            >
              Nova Manifestação
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
          </nav>
        </div>
      </header>
    </>
  );
}
