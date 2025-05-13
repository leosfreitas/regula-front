import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { useState, useEffect, useRef } from "react";

export const Home = () => {
  // Estados para animações e interatividade
  const [animationStep, setAnimationStep] = useState(0);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [countUp, setCountUp] = useState({
    productivity: 0,
    cost: 0,
    satisfaction: 0,
    partnerships: 0
  });
  const [statsVisible, setStatsVisible] = useState(false);
  const [simulationVisible, setSimulationVisible] = useState(false);

  // Referências para observar quando os elementos ficam visíveis
  const statsRef = useRef(null);
  const simulationRef = useRef(null);
  
  // Efeito para animação de contagem dos números principais quando visíveis
  useEffect(() => {
    if (statsVisible && !simulationComplete) {
      const interval = setInterval(() => {
        setCountUp(prev => {
          const newValues = {
            productivity: prev.productivity >= 50 ? 50 : prev.productivity + 1,
            cost: prev.cost >= 38 ? 38 : prev.cost + 1,
            satisfaction: prev.satisfaction >= 20 ? 20 : prev.satisfaction + 1,
            partnerships: prev.partnerships >= 10 ? 10 : prev.partnerships + 1
          };
          
          // Verifica se todos os valores atingiram seu máximo
          if (newValues.productivity === 50 && newValues.cost === 38 && 
              newValues.satisfaction === 20 && newValues.partnerships === 10) {
            clearInterval(interval);
          }
          
          return newValues;
        });
      }, 40);

      return () => clearInterval(interval);
    }
  }, [statsVisible, simulationComplete]);

  // Observer para detectar quando as estatísticas estão visíveis
  useEffect(() => {
    const statsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      statsObserver.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        statsObserver.unobserve(statsRef.current);
      }
    };
  }, []);

  // Observer para detectar quando a simulação está visível
  useEffect(() => {
    const simulationObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSimulationVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (simulationRef.current) {
      simulationObserver.observe(simulationRef.current);
    }

    return () => {
      if (simulationRef.current) {
        simulationObserver.unobserve(simulationRef.current);
      }
    };
  }, []);

  // Efeito para iniciar a animação quando a seção estiver visível
  useEffect(() => {
    if (simulationVisible && !simulationComplete) {
      // Espera 2 segundos antes de iniciar
      const startTimeout = setTimeout(() => {
        startSimulation();
      }, 2000);

      return () => clearTimeout(startTimeout);
    }
  }, [simulationVisible, simulationComplete]);

  // Função para avançar a simulação passo a passo
  const startSimulation = () => {
    setAnimationStep(1); // Começa no primeiro passo
    
    // Define os tempos para cada etapa da simulação
    const steps = [1, 2, 3, 4, 5];
    
    // Função para avançar para o próximo passo
    const advanceToNextStep = (stepIndex: number) => {
      if (stepIndex >= steps.length) {
        setSimulationComplete(true);
        return;
      }
      
      setTimeout(() => {
        setAnimationStep(steps[stepIndex]);
        advanceToNextStep(stepIndex + 1);
      }, 2500); // 2.5 segundos por etapa
    };
    
    // Inicia a sequência
    advanceToNextStep(1);
  };

  // Documentos para o processamento
  const documents = [
    { id: 1, name: "CNH", color: "blue-900" },
    { id: 2, name: "Documento do Veículo", color: "blue-700" },
    { id: 3, name: "Apólice de Seguro", color: "blue-600" },
    { id: 4, name: "Boletim de Ocorrência", color: "blue-500" },
    { id: 5, name: "Dados Serasa/Nortix", color: "blue-400" }
  ];

  // Função para verificar se o documento está ativo na animação
  const isDocumentActive = (docId: number) => {
    return animationStep >= docId;
  };

  return (
    <>
      <Header />

      <div className="relative w-full h-[90vh] z-0 top-0">
        <img
          src="/landing_page/background1.png"
          alt="Landing"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="w-full px-8 md:px-24 text-left">
            <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight mb-4">
              Simplificando a<br />regulação com<br />inteligência artificial.
            </h1>
            <p className="text-white text-lg md:text-xl mb-6">
              Automação de sinistros<br className="md:hidden" /> com rapidez, precisão e<br className="md:hidden" /> segurança.
            </p>
            <button className="bg-blue-900 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition duration-300 cursor-pointer">
              Entre em Contato
            </button>
          </div>
        </div>
      </div>

      <section className="py-18 px-4 bg-white w-full">
        <div className="w-[90%] mx-auto">
          <div className="flex flex-col mb-12">
            <h2 className="text-4xl md:text-4xl font-medium mb-6 text-gray-900">Regula.ai</h2>
            <p className="text-lg md:text-2xl leading-relaxed text-gray-700 text-justify w-full">
              A Regula.ai transforma a regulação de sinistros com tecnologia de ponta para que seguradoras operem com mais agilidade, precisão e economia. Combinando inteligência artificial e expertise no setor, oferecemos soluções automatizadas que reduzem fraudes, aceleram análises e melhoram a experiência do cliente. Acreditamos que a automação é chave para uma regulação mais estratégica, capaz de antecipar riscos e gerar decisões mais assertivas. Conte com uma solução moderna, segura e adaptável às necessidades do seu negócio.
            </p>
            <a href="#" className="text-xl text-gray-500 mt-6 hover:underline self-start">Saiba mais &gt;</a>
          </div>

          <div ref={statsRef} className="display flex flex-col md:flex-row justify-between items-center gap-6 w-full py-12">
            <div className="">
              <p className="text-3xl md:text-6xl font-bold text-blue-900 transition-all duration-1000">
                +{countUp.productivity}%
              </p>
              <p className="text-base md:text-xl text-gray-700 ">Produtividade</p>
            </div>
            <div className="">
              <p className="text-3xl md:text-6xl font-bold text-blue-900 transition-all duration-1000">
                {countUp.cost}%
              </p>
              <p className="text-base md:text-xl text-gray-700 ">Diminuição dos gastos</p>
            </div>
            <div className="">
              <p className="text-3xl md:text-6xl font-bold text-blue-900 transition-all duration-1000">
                +{countUp.satisfaction}%
              </p>
              <p className="text-base md:text-xl text-gray-700 ">Satisfação dos clientes</p>
            </div>
            <div className="">
              <p className="text-3xl md:text-6xl font-bold text-blue-900 transition-all duration-1000">
                +{countUp.partnerships}
              </p>
              <p className="text-base md:text-xl text-gray-700 ">Parcerias</p>
            </div>
          </div>
        </div>
      </section>

      <div className="relative w-full h-[70vh] z-0">
        <img
          src="/landing_page/background2.png"
          alt="Landing"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Seção de Solução com Animações - Seguindo o design da imagem de referência */}
      <section ref={simulationRef} className="py-20 px-4 bg-gray-50 text-gray-800 overflow-hidden">
        <div className="max-w-[1300px] mx-auto">
          <h2 className="text-4xl font-bold mb-10 text-gray-900">Processamento Inteligente de Sinistros</h2>
          
          {/* Contêiner para a timeline com padding lateral adicional */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 mb-16 overflow-hidden">
            <div className="overflow-x-auto pb-8">
              {/* Timeline com largura fixa para garantir que as extremidades sejam visíveis */}
              <div className="relative" style={{ minWidth: "1000px", height: "150px", padding: "0 60px" }}>
                {/* Linha base horizontal */}
                <div className="absolute h-1 bg-gray-200 left-16 right-16 top-16" style={{ zIndex: 1 }}></div>
                
                {/* Barra de progresso azul */}
                <div 
                  className="absolute h-1 bg-blue-600 left-16 top-16 transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${Math.min(100, (animationStep * 25))}%`,
                    zIndex: 2
                  }}
                ></div>
                
                {/* Círculos numerados (com posições ajustadas para garantir visibilidade completa) */}
                {documents.map((doc, index) => {
                  // Calcular a posição em % com espaço para os círculos das extremidades
                  const position = index === 0 ? "0%" : 
                                  index === 4 ? "100%" : 
                                  `${(index * 25)}%`;
                  
                  // Calcular a transformação para centralizar os círculos
                  const transform = index === 0 ? "translateX(0)" : 
                                   index === 4 ? "translateX(-100%)" : 
                                   "translateX(-50%)";
                  
                  return (
                    <div 
                      key={doc.id} 
                      className="absolute top-0"
                      style={{ 
                        left: position,
                        transform: transform,
                        transition: "all 0.5s ease",
                        zIndex: 3
                      }}
                    >
                      <div 
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl transition-all duration-700 ${
                          isDocumentActive(doc.id) 
                            ? `bg-${doc.color}` 
                            : "bg-gray-200"
                        }`}
                      >
                        {doc.id}
                      </div>
                      <div 
                        className={`mt-2 text-center w-32 mx-auto transition-all duration-700 ${
                          isDocumentActive(doc.id) ? "text-gray-800" : "text-gray-400"
                        }`}
                      >
                        {doc.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Contêiner para o resultado - Centralizado e com mais espaço superior */}
            <div className="mt-16 flex justify-center">
              {/* Resultado final após todos os documentos */}
              <div className={`transition-all duration-1000 w-full ${
                animationStep >= 5 
                  ? "opacity-100 transform translate-y-0" 
                  : "opacity-0 transform translate-y-10"
              }`}>
                {animationStep >= 5 && (
                  <div className="bg-blue-900 text-white rounded-lg shadow-xl p-8 max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h3 className="text-2xl font-bold text-center md:text-left">Análise Concluída com Sucesso</h3>
                        <p className="text-blue-100 text-center md:text-left">Todos os documentos foram verificados e aprovados</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center">
                        <div className="text-xl font-medium text-blue-100">Tempo de Processamento</div>
                        <div className="text-3xl font-bold mt-1">3 min</div>
                      </div>
                      <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center">
                        <div className="text-xl font-medium text-blue-100">Economia Estimada</div>
                        <div className="text-3xl font-bold mt-1">R$ 2.300</div>
                      </div>
                      <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center">
                        <div className="text-xl font-medium text-blue-100">Confiabilidade</div>
                        <div className="text-3xl font-bold mt-1">99,4%</div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="inline-block px-8 py-4 bg-white text-blue-900 rounded-md font-bold text-lg">
                        Sinistro Aprovado para Pagamento
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6">Pronto para transformar sua operação?</h3>
            <button className="bg-blue-900 text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-blue-800 transition duration-300 transform hover:scale-105">
              Solicite uma demonstração
            </button>
          </div>
        </div>
      </section>
          
      <section className="py-16 px-4 bg-gray-50">
        <div className="w-[90%] mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Perguntas Frequentes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-left">
              <h3 className="text-xl font-bold mb-3">Como a Regula.ai pode ajudar minha empresa?</h3>
              <p className="text-gray-700">Nossa solução de IA automatiza o processo de regulação de sinistros, reduzindo custos operacionais e acelerando o atendimento ao cliente.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-left">
              <h3 className="text-xl font-bold mb-3">Quanto tempo leva para implementar a solução?</h3>
              <p className="text-gray-700">O processo de implementação geralmente leva de 4 a 6 semanas, dependendo da complexidade e tamanho da sua operação.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-left">
              <h3 className="text-xl font-bold mb-3">A solução é compatível com nossos sistemas atuais?</h3>
              <p className="text-gray-700">Sim, desenvolvemos integrações personalizadas com os principais sistemas de gestão de seguros do mercado.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-left">
              <h3 className="text-xl font-bold mb-3">Como é feito o suporte técnico?</h3>
              <p className="text-gray-700">Oferecemos suporte técnico 24/7 via chat, e-mail e telefone, com garantia de resposta em até 2 horas para casos críticos.</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes progressBar {
          0% { width: 0; }
          100% { width: 100%; }
        }
      `}</style>

      <Footer />
    </>
  );
};