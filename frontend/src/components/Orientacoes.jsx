import React from 'react';
import { Shield, AlertTriangle, HelpCircle, ListChecks, Mic, FileText, Image, Video, UserX, ClipboardList } from 'lucide-react';

export default function Orientacoes() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* Introducao */}
      <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">Como funciona a Ouvidoria?</h3>
        <p className="text-gray-700 leading-relaxed">
          A Ouvidoria e o canal oficial para o cidadao se comunicar com o Governo do Distrito Federal.
          Voce pode registrar reclamacoes, denuncias, sugestoes ou elogios sobre servicos publicos.
          Para acompanhar e receber a resposta, voce pode se identificar ou manter o anonimato.
        </p>
      </section>

      {/* Protecao ao Denunciante */}
      <section className="bg-white rounded-xl shadow-lg border border-blue-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Shield size={24} className="text-gov-blue" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Protecao ao Denunciante</h3>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
          <p className="text-sm font-semibold text-blue-800 mb-2">Decreto n. 36.462/2015</p>
          <ul className="space-y-2 text-sm text-blue-900">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1" aria-hidden="true">&#8226;</span>
              <span><strong>Sigilo absoluto</strong> dos dados pessoais do denunciante</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1" aria-hidden="true">&#8226;</span>
              <span><strong>Confidencialidade obrigatoria</strong> em todas as etapas do processo</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1" aria-hidden="true">&#8226;</span>
              <span><strong>Responsabilizacao</strong> de agentes publicos por descumprimento do sigilo</span>
            </li>
          </ul>
        </div>
        <p className="text-sm text-gray-600">
          Conforme a Lei Distrital n. 6.519/2020 e a Instrucao Normativa CGDF n. 01/2017,
          sua identidade e preservada e somente a Controladoria-Geral do DF tera acesso aos seus dados.
        </p>
      </section>

      {/* Avisos Importantes */}
      <section className="bg-white rounded-xl shadow-lg border border-yellow-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-yellow-100 p-2 rounded-lg">
            <AlertTriangle size={24} className="text-yellow-600" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Avisos Importantes</h3>
        </div>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <span className="text-yellow-600 font-bold mt-0.5">1.</span>
            <span className="text-sm text-yellow-900">
              <strong>Nao inclua dados pessoais</strong> (CPF, RG, endereco, telefone) no texto ou nos anexos
              da sua manifestacao. Isso protege voce e terceiros.
            </span>
          </li>
          <li className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <span className="text-yellow-600 font-bold mt-0.5">2.</span>
            <span className="text-sm text-yellow-900">
              Registre <strong>um assunto por manifestacao</strong>. Se tiver mais de um problema,
              faca registros separados para facilitar o encaminhamento.
            </span>
          </li>
          <li className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <span className="text-yellow-600 font-bold mt-0.5">3.</span>
            <span className="text-sm text-yellow-900">
              Para manifestacoes sobre <strong>orgaos federais</strong> (INSS, Receita Federal, Correios etc.),
              utilize o sistema <strong>Fala.BR</strong> do Governo Federal.
            </span>
          </li>
        </ul>
      </section>

      {/* Dicas para um bom registro */}
      <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-100 p-2 rounded-lg">
            <HelpCircle size={24} className="text-green-600" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Dicas para um bom registro</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Para que sua manifestacao seja encaminhada com agilidade, tente responder estas perguntas:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { q: 'O que voce precisa?', ex: 'Tipo de solicitacao ou problema' },
            { q: 'O que ocorreu?', ex: 'Descreva os fatos com detalhes' },
            { q: 'Quem esta envolvido?', ex: 'Orgao, servidor ou setor responsavel' },
            { q: 'Quando ocorreu?', ex: 'Data e horario aproximados' },
            { q: 'Onde aconteceu?', ex: 'Local, endereco ou unidade' },
            { q: 'Como ocorreu?', ex: 'Circunstancias e contexto' },
          ].map((item) => (
            <div key={item.q} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="font-semibold text-sm text-gray-800">{item.q}</p>
              <p className="text-xs text-gray-600 mt-1">{item.ex}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Passo a Passo */}
      <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-100 p-2 rounded-lg">
            <ListChecks size={24} className="text-purple-600" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Passo a Passo</h3>
        </div>
        <ol className="space-y-4">
          {[
            {
              icon: ClipboardList,
              title: 'Escolha o tipo',
              desc: 'Selecione entre denuncia, reclamacao, sugestao ou elogio.',
              color: 'text-blue-600 bg-blue-100',
            },
            {
              icon: UserX,
              title: 'Identificacao',
              desc: 'Escolha se deseja se identificar ou manter o anonimato. Sua identidade sera preservada conforme a legislacao.',
              color: 'text-orange-600 bg-orange-100',
            },
            {
              icon: FileText,
              title: 'Descreva ou anexe',
              desc: 'Escreva sua manifestacao por texto ou pule para enviar por audio, foto ou video. A descricao e opcional.',
              color: 'text-green-600 bg-green-100',
            },
            {
              icon: Mic,
              title: 'Grave um audio',
              desc: 'Use o microfone do seu dispositivo para gravar um relato por voz diretamente pelo navegador.',
              color: 'text-red-600 bg-red-100',
            },
            {
              icon: Image,
              title: 'Anexe imagem ou video',
              desc: 'Tire uma foto ou grave um video para complementar ou substituir o relato por texto.',
              color: 'text-cyan-600 bg-cyan-100',
            },
            {
              icon: Shield,
              title: 'Receba seu protocolo',
              desc: 'Apos o envio, voce recebera um protocolo e uma senha de 4 digitos. Guarde ambos para acompanhar o andamento.',
              color: 'text-purple-600 bg-purple-100',
            },
          ].map((step, idx) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${step.color}`}>
                  <Icon size={20} aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    <span className="text-gray-400 mr-1">{idx + 1}.</span>
                    {step.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{step.desc}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* CTA */}
      <div className="text-center pb-4">
        <a
          href="/"
          className="inline-flex items-center gap-2 bg-gov-blue text-white font-bold py-4 px-8 rounded-lg hover:bg-gov-dark transition-colors focus:ring-4 focus:ring-blue-300 text-lg"
        >
          <FileText size={20} aria-hidden="true" />
          Fazer Registro
        </a>
      </div>

    </div>
  );
}
