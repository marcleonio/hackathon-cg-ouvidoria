import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Eye, Megaphone, Menu } from 'lucide-react';

export default function Header() {
  const { highContrast, toggleHighContrast } = useAccessibility();

  return (
    <header className="bg-gov-blue text-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-full text-gov-blue">
            <Megaphone size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">Ouvidoria DF</h1>
            <p className="text-xs opacity-90">Canal de Denúncias e Sugestões</p>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <button
            onClick={toggleHighContrast}
            className="flex items-center gap-2 p-2 rounded hover:bg-gov-dark transition-colors focus:outline-none focus:ring-2 focus:ring-amber-300"
            aria-label={highContrast ? "Desativar Alto Contraste" : "Ativar Alto Contraste"}
            aria-pressed={highContrast}
          >
            <Eye size={20} />
            <span className="hidden sm:inline text-sm font-medium">
              {highContrast ? 'Contraste Padrão' : 'Alto Contraste'}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
