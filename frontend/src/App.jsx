import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AccessibilityProvider } from './context/AccessibilityContext';
import Header from './components/Header';
import ManifestacaoForm from './components/ManifestacaoForm';
import ConsultaProtocolo from './components/ConsultaProtocolo';

function HomePage() {
  return (
    <>
      <section className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gov-dark mb-3">Manifestação Online</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
          Contribua para a melhoria dos serviços públicos do DF.
          Registre reclamações, denúncias, sugestões ou elogios com segurança e agilidade.
        </p>
      </section>
      <ManifestacaoForm />
    </>
  );
}

function ConsultaPage() {
  return (
    <>
      <section className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gov-dark mb-3">Consulta de Protocolo</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
          Acompanhe o status da sua manifestação informando o número do protocolo.
        </p>
      </section>
      <ConsultaProtocolo />
    </>
  );
}

function App() {
  return (
    <AccessibilityProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 flex flex-col transition-colors duration-300">
          <Header />

          <main id="conteudo-principal" className="container mx-auto px-4 py-8 flex-1" role="main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/consulta" element={<ConsultaPage />} />
            </Routes>
          </main>

          <footer className="bg-gov-dark text-white py-6 px-4" role="contentinfo">
            <div className="container mx-auto text-center text-sm space-y-2">
              <p className="font-semibold">
                Controladoria-Geral do Distrito Federal (CGDF)
              </p>
              <p className="opacity-80">
                Participa DF — Plataforma de Ouvidoria e Acesso à Informação
              </p>
              <p className="opacity-60 text-xs">
                Desenvolvido para o 1&#186; Hackathon em Controle Social: Desafio Participa DF — 2026
              </p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AccessibilityProvider>
  );
}

export default App;
