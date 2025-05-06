import React, { useState } from "react";

const faqData = [
  {
    question: "O que é a Regula.ai?",
    answer:
      "A Regula.ai é uma plataforma de inteligência artificial desenvolvida para automatizar o processo de regulação de sinistros, tornando-o mais ágil, preciso e seguro para seguradoras e seus clientes.",
  },
  {
    question: "Como a Regula.ai ajuda seguradoras?",
    answer:
      "Oferecemos soluções que automatizam a análise de documentos, cruzamento de dados e detecção de inconsistências, reduzindo o tempo de resposta e o risco de fraudes.",
  },
  {
    question: "Que tipos de sinistros a Regula.ai consegue processar?",
    answer: "A Regula.ai é capaz de processar diversos tipos de sinistros, incluindo automóveis, residência, saúde e mais.",
  },
  {
    question: "O que é uma sociedade ?",
    answer: "Uma sociedade, no contexto de seguros, refere-se a uma empresa registrada como operadora de seguros.",
  },
  {
    question: "É preciso integrar com o sistema da seguradora?",
    answer: "Não necessariamente. Oferecemos APIs e painéis próprios que podem funcionar de forma independente ou integradas.",
  },
  {
    question: "Como é feita a validação dos dados?",
    answer: "Utilizamos modelos de IA treinados em grandes volumes de documentos para garantir a veracidade das informações.",
  },
  {
    question: "A Regula.ai é segura?",
    answer: "Sim. Utilizamos padrões rigorosos de segurança da informação e criptografia para proteger os dados dos clientes.",
  },
];

export const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-16 px-6 md:px-12 bg-white text-gray-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Perguntas Frequentes</h2>
        <p className="text-lg text-gray-600 mb-10">Possui dúvidas sobre a Regula.ai?</p>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div key={index} className="border-b pb-4">
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center text-left text-lg font-medium focus:outline-none"
              >
                <span className={`${openIndex === index ? "font-bold text-blue-900" : ""}`}>
                  {item.question}
                </span>
                <span className="text-xl">
                  {openIndex === index ? "▲" : "▼"}
                </span>
              </button>

              {openIndex === index && (
                <div className="mt-2 text-gray-700 text-base">{item.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
