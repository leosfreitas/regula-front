import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { useState, useEffect, useRef } from "react";

export const Home = () => {
  // refs para observers e timeouts
  const statsRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<number[]>([]);

  // estados
  const [animationStep, setAnimationStep] = useState(0);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [countUp, setCountUp] = useState({
    productivity: 0,
    cost: 0,
    satisfaction: 0,
    partnerships: 0,
  });
  const [statsVisible, setStatsVisible] = useState(false);
  const [simulationVisible, setSimulationVisible] = useState(false);

  // 1) Contador de estatísticas (mais rápido: 20ms)
  useEffect(() => {
    if (!statsVisible) return;
    const intervalId = window.setInterval(() => {
      setCountUp((prev) => {
        const next = {
          productivity: Math.min(prev.productivity + 1, 50),
          cost: Math.min(prev.cost + 1, 38),
          satisfaction: Math.min(prev.satisfaction + 1, 20),
          partnerships: Math.min(prev.partnerships + 1, 10),
        };
        if (
          next.productivity === 50 &&
          next.cost === 38 &&
          next.satisfaction === 20 &&
          next.partnerships === 10
        ) {
          clearInterval(intervalId);
        }
        return next;
      });
    }, 20);

    return () => clearInterval(intervalId);
  }, [statsVisible]);

  // 2) IntersectionObserver para stats
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setStatsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => {
      if (statsRef.current) obs.unobserve(statsRef.current);
    };
  }, []);

  // 3) IntersectionObserver para simulação
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setSimulationVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (simulationRef.current) obs.observe(simulationRef.current);
    return () => {
      if (simulationRef.current) obs.unobserve(simulationRef.current);
    };
  }, []);

  // 4) Inicia/reset da simulação ao entrar na view
  useEffect(() => {
    if (!simulationVisible) return;

    // limpa timeouts antigos e reseta estado
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
    setAnimationStep(0);
    setSimulationComplete(false);

    // espera 1s antes de começar (era 2s)
    const startId = window.setTimeout(() => {
      startSimulation();
    }, 1000);
    timeoutsRef.current.push(startId);

    return () => {
      timeoutsRef.current.forEach((id) => clearTimeout(id));
      timeoutsRef.current = [];
    };
  }, [simulationVisible]);

  // 5) Função de simulação em sequência (passos mais rápidos: 1s)
  const startSimulation = () => {
    const steps = [1, 2, 3, 4, 5];
    setAnimationStep(1);

    let accumulated = 0;
    steps.slice(1).forEach((stepValue) => {
      accumulated += 1000; // era 2500
      const id = window.setTimeout(() => {
        setAnimationStep(stepValue);
        if (stepValue === 5) {
          setSimulationComplete(true);
        }
      }, accumulated);
      timeoutsRef.current.push(id);
    });
  };

  // Documentos com cores fixas
  const documents = [
    { id: 1, name: "CNH", activeColor: "bg-blue-800" },
    { id: 2, name: "Documento do Veículo", activeColor: "bg-blue-700" },
    { id: 3, name: "Apólice de Seguro", activeColor: "bg-blue-600" },
    { id: 4, name: "Boletim de Ocorrência", activeColor: "bg-blue-500" },
    { id: 5, name: "Dados Serasa/Nortix", activeColor: "bg-blue-400" },
  ];

  const isDocumentActive = (docId: number) => animationStep >= docId;

  return (
    <>
      <Header />

      {/* Hero */}
      <div className="relative w-full h-[90vh]">
        <img
          src="/landing_page/background1.png"
          alt="Landing"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="absolute inset-0 flex items-center px-8 md:px-24">
          <div>
            <h1 className="text-white text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Simplificando a<br />regulação com<br />inteligência artificial.
            </h1>
            <p className="text-white text-lg md:text-xl mb-6">
              Automação de sinistros<br className="md:hidden" />
              com rapidez, precisão e<br className="md:hidden" />
              segurança.
            </p>
            <button className="bg-blue-900 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition">
              Entre em Contato
            </button>
          </div>
        </div>
      </div>

      {/* Sobre */}
      <section className="py-18 px-4 bg-white">
        <div className="w-[90%] mx-auto">
          <h2 className="text-4xl font-medium mb-6 text-gray-900">Regula.ai</h2>
          <p className="text-lg md:text-2xl text-gray-700 leading-relaxed">
            A Regula.ai transforma a regulação de sinistros com tecnologia de ponta
            para que seguradoras operem com mais agilidade, precisão e economia.
          </p>
          <a href="#" className="text-xl text-gray-500 hover:underline mt-6 inline-block">
            Saiba mais &gt;
          </a>

          {/* Stats */}
          <div ref={statsRef} className="flex flex-col md:flex-row justify-between items-center gap-6 py-12">
            <div>
              <p className="text-3xl md:text-6xl font-bold text-blue-900">+{countUp.productivity}%</p>
              <p className="text-base md:text-xl text-gray-700">Produtividade</p>
            </div>
            <div>
              <p className="text-3xl md:text-6xl font-bold text-blue-900">{countUp.cost}%</p>
              <p className="text-base md:text-xl text-gray-700">Diminuição dos gastos</p>
            </div>
            <div>
              <p className="text-3xl md:text-6xl font-bold text-blue-900">+{countUp.satisfaction}%</p>
              <p className="text-base md:text-xl text-gray-700">Satisfação dos clientes</p>
            </div>
            <div>
              <p className="text-3xl md:text-6xl font-bold text-blue-900">+{countUp.partnerships}</p>
              <p className="text-base md:text-xl text-gray-700">Parcerias</p>
            </div>
          </div>
        </div>
      </section>

      {/* Imagem de transição */}
      <div className="relative w-full h-[70vh]">
        <img
          src="/landing_page/background2.png"
          alt="Landing"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Simulação */}
      <section ref={simulationRef} className="py-20 px-4 bg-gray-50 overflow-hidden">
        <div className="max-w-[1300px] mx-auto">
          <h2 className="text-4xl font-bold mb-10 text-gray-900">Processamento Inteligente de Sinistros</h2>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 mb-16">
            <div className="overflow-x-auto">
              <div className="relative" style={{ minWidth: "1000px", height: 150 }}>
                {/* linha cinza: começa/termina 60px dentro do container, deslocada para dar espaço */}
                <div
                  className="absolute h-1 bg-gray-200"
                  style={{ top: "80px", left: "60px", right: "60px", zIndex: 1 }}
                />

                {/* linha azul: mesma indentação + largura proporcional */}
                <div
                  className="absolute h-1 bg-blue-600 transition-all duration-500 ease-out"
                  style={{
                    top: "80px",
                    left: "60px",
                    width: `calc((100% - 120px) * ${(animationStep - 1) / 4})`,
                    zIndex: 2,
                  }}
                />

                {documents.map((doc, idx) => {
                  const last = documents.length - 1;
                  return (
                    <div
                      key={doc.id}
                      className="absolute top-0 flex flex-col items-center z-30"
                      style={{
                        left: `calc(60px + (100% - 120px) * ${idx / last})`,
                        transform: "translateX(-50%)",
                        zIndex: 3,
                      }}
                    >
                      <div
                        className={[
                          "w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-500",
                          isDocumentActive(doc.id) ? doc.activeColor : "bg-gray-200",
                        ].join(" ")}
                      >
                        <span className="text-white">{doc.id}</span>
                      </div>
                      {/* sobe a legenda 0.5rem a mais */}
                      <div
                        className={[
                          "mt-8 text-center transition-all duration-500",
                          isDocumentActive(doc.id) ? "text-gray-800" : "text-gray-400",
                        ].join(" ")}
                      >
                        {doc.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resultado final */}
            <div className="mt-16 flex justify-center">
              <div
                className={`transition-all duration-500 w-full ${
                  animationStep >= 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                {animationStep >= 5 && (
                  <div className="bg-blue-900 text-white rounded-lg shadow-xl p-8 max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h3 className="text-2xl font-bold">Análise Concluída com Sucesso</h3>
                        <p className="text-blue-100">Todos os documentos foram verificados e aprovados</p>
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

          {/* CTA */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6">Pronto para transformar sua operação?</h3>
            <button className="bg-blue-900 text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-blue-800 transition transform hover:scale-105">
              Solicite uma demonstração
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="w-[90%] mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Perguntas Frequentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ... itens de FAQ ... */}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
