import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();
  const statsRef = useRef<HTMLDivElement>(null);
  const [countUp, setCountUp] = useState({
    productivity: 0,
    cost: 0,
    satisfaction: 0,
    partnerships: 0,
  });
  const [statsVisible, setStatsVisible] = useState(false);

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

  const [fill, setFill] = useState(false);
  const funcRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!funcRef.current) return;
    const obs = new IntersectionObserver(
      ([entry], observer) => {
        if (entry.isIntersecting) {
          setFill(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(funcRef.current);
    return () => obs.disconnect();
  }, []);

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
              Simplificando a
              <br />
              regulação com
              <br />
              inteligência artificial.
            </h1>
            <p className="text-white text-lg md:text-xl mb-6">
              Automação de sinistros
              <br className="md:hidden" />
              com rapidez, precisão e
              <br className="md:hidden" />
              segurança.
            </p>
            <button 
              className="bg-blue-900 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition cursor-pointer"
              onClick={() => navigate("/contact")}
              >
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
            A Regula.ai transforma a regulação de sinistros com tecnologia de
            ponta para que seguradoras operem com mais agilidade, precisão e
            economia.
          </p>
          <a
            href="#"
            className="text-xl text-gray-500 hover:underline mt-6 inline-block"
          >
            Saiba mais &gt;
          </a>

          {/* Stats */}
          <div
            ref={statsRef}
            className="flex flex-col md:flex-row justify-between items-center gap-6 py-12"
          >
            <div>
              <p className="text-3xl md:text-6xl font-bold text-blue-900">
                +{countUp.productivity}%
              </p>
              <p className="text-base md:text-xl text-gray-700">
                Produtividade
              </p>
            </div>
            <div>
              <p className="text-3xl md:text-6xl font-bold text-blue-900">
                {countUp.cost}%
              </p>
              <p className="text-base md:text-xl text-gray-700">
                Diminuição dos gastos
              </p>
            </div>
            <div>
              <p className="text-3xl md:text-6xl font-bold text-blue-900">
                +{countUp.satisfaction}%
              </p>
              <p className="text-base md:text-xl text-gray-700">
                Satisfação dos clientes
              </p>
            </div>
            <div>
              <p className="text-3xl md:text-6xl font-bold text-blue-900">
                +{countUp.partnerships}
              </p>
              <p className="text-base md:text-xl text-gray-700">Parcerias</p>
            </div>
          </div>
        </div>
      </section>

      {/* Imagem de transição com card */}
      <section className="relative w-full h-[70vh]">
        <img
          src="/landing_page/background2.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50 " />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center h-full max-h-[70vh] mx-42 md:px-24 gap-42">
          <div className="w-full md:w-5/12 lg:w-4/12 space-y-6 text-white">
            <span className="inline-block px-4 py-1 rounded-full border border-white text-xs font-medium tracking-widest">
              WHY CHOOSE US ?
            </span>
            <h2 className="text-4xl font-bold leading-tight">
              A solução ideal para a
              <br />
              sua seguradora 
            </h2>
            <p className="text-lg">
              Revolucionamos o setor de seguros tornando a validação de sinistros automática uma realidade acessível para todas as seguradoras. 
              Aumente a sua eficiência operacional e reduza custos com a Regula.ai.
            </p>
          </div>
          <div className="w-full md:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-xl border border-gray-100 flex items-start space-x-4">
              <svg
                className="w-8 h-8 stroke-gray-900"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
                <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
              </svg>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-gray-900">Worldwide</h3>
                <p className="text-gray-600 text-sm">
                  Send packages globally from any city with matching travelers.
                </p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-100 flex items-start space-x-4">
              <svg
                className="w-8 h-8 stroke-gray-900"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="8" />
                <path d="M8 12h8M8 15h8M8 9h8" />
              </svg>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-gray-900">Profitable</h3>
                <p className="text-gray-600 text-sm">
                  Earn money on travel and fund future trips at reduced costs.
                </p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-100 flex items-start space-x-4">
              <svg
                className="w-8 h-8 stroke-gray-900"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M3 3v18h18" />
                <path d="M8 16l3-3 2 2 5-5" />
              </svg>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-gray-900">Economical</h3>
                <p className="text-gray-600 text-sm">
                  Reduce shipping costs by matching travelers to carry packages.
                </p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-100 flex items-start space-x-4">
              <svg
                className="w-8 h-8 stroke-gray-900"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M12 3l8 4v5a8 8 0 01-16 0V7l8-4z" />
                <path d="M12 11v4" />
                <path d="M10 13h4" />
              </svg>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-gray-900">Secure Payment</h3>
                <p className="text-gray-600 text-sm">
                  Payments are safely held until delivery or refunded if the trip is canceled.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section ref={funcRef} className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center text-gray-900">
            Como Funciona
          </h2>

          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-px bg-gray-300" />

            <div
              className="absolute left-0 top-1/2 transform -translate-y-1/2 h-[2px] bg-blue-800"
              style={{
                width: fill ? "100%" : "0%",
                transition: "width 5s ease-out",
              }}
            />

            <div className="grid grid-cols-3 gap-x-8">
              <div className="relative flex flex-col items-center">
                <span className="w-8 h-8 rounded-full bg-black border-4 border-gray-200 absolute top-1/2 transform -translate-y-1/2" />
                <div className="mt-36 text-center">
                  <h3 className="font-semibold text-xl mb-2">
                    1. Envio de Documentos
                  </h3>
                  <p className="text-gray-600">
                    Faça upload de CNH, apólice, boletim e demais arquivos em um
                    único clique.
                  </p>
                </div>
              </div>

              <div className="relative flex flex-col items-center">
                <span className="w-8 h-8 rounded-full bg-black border-4 border-gray-200 absolute top-1/2 transform -translate-y-1/2" />
                <div className="mb-36 text-center">
                  <h3 className="font-semibold text-xl mb-2">
                    2. Processamento Automático
                  </h3>
                  <p className="text-gray-600">
                    Nosso motor de IA lê e valida cada documento em segundos.
                  </p>
                </div>
              </div>

              <div className="relative flex flex-col items-center">
                <span className="w-8 h-8 rounded-full bg-black border-4 border-gray-200 absolute top-1/2 transform -translate-y-1/2" />
                <div className="mt-36 text-center">
                  <h3 className="font-semibold text-xl mb-2">
                    3. Aprovação Instantânea
                  </h3>
                  <p className="text-gray-600">
                    Receba o resultado final e siga diretamente para o
                    pagamento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Perguntas Frequentes */}
      <section className="py-16 px-6 md:px-24 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Perguntas Frequentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-left">
              <h3 className="text-xl font-bold mb-3">
                Como a Regula.ai pode ajudar minha empresa?
              </h3>
              <p className="text-gray-700">
                Nossa solução de IA automatiza o processo de regulação de
                sinistros, reduzindo custos operacionais e acelerando o
                atendimento ao cliente.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-left">
              <h3 className="text-xl font-bold mb-3">
                Quanto tempo leva para implementar a solução?
              </h3>
              <p className="text-gray-700">
                O processo de implementação geralmente leva de 4 a 6 semanas,
                dependendo da complexidade e tamanho da sua operação.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-left">
              <h3 className="text-xl font-bold mb-3">
                A solução é compatível com nossos sistemas atuais?
              </h3>
              <p className="text-gray-700">
                Sim, desenvolvemos integrações personalizadas com os principais
                sistemas de gestão de seguros do mercado.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-left">
              <h3 className="text-xl font-bold mb-3">
                Como é feito o suporte técnico?
              </h3>
              <p className="text-gray-700">
                Oferecemos suporte técnico 24/7 via chat, e-mail e telefone, com
                garantia de resposta em até 2 horas para casos críticos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
