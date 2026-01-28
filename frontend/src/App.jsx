import React from 'react';
import { AccessibilityProvider } from './context/AccessibilityContext';
import Header from './components/Header';
import ManifestacaoForm from './components/ManifestacaoForm';

function App() {
  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-gray-50 pb-12 transition-colors duration-300">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <section className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gov-dark mb-3">Manifestação Online</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Contribua para a melhoria dos serviços públicos do DF. 
              Utilize este canal para registrar sua manifestação com segurança e agilidade.
            </p>
          </section>
          
          <ManifestacaoForm />
        </main>
      </div>
    </AccessibilityProvider>
  );
}

export default App;
