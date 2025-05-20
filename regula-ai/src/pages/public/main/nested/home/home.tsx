import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { useState, useEffect, useRef } from "react";

export const Home = () => {
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
      setCountUp(prev => {
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

      {/* Imagem de transição com card */}
      <div className="relative w-full h-[70vh]">
        <img
          src="/landing_page/background2.png"
          alt="Landing"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl w-full">
            <h3 className="text-2xl font-semibold mb-4">Frase de Efeito</h3>
            <p className="text-gray-700 mb-8">
              Conte com a gente para melhorar a performance de sua empresa.
            </p>
            <div className="flex items-center justify-between text-center text-gray-800 text-base">
              <div className="flex-1">Acurácia aumentada</div>
              <div className="border-l h-6 mx-4"></div>
              <div className="flex-1">Taxa de aceitação</div>
              <div className="border-l h-6 mx-4"></div>
              <div className="flex-1">Preço acessível</div>
            </div>
            <div className="mt-8 text-right">
              <button className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition">
                Entre em Contato
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Como Funciona */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-10 text-gray-900">
            Como Funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg">
              <div className="mb-4">
                <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" /* ... */ />
              </div>
              <h3 className="font-semibold text-xl mb-2">1. Envio de Documentos</h3>
              <p className="text-gray-600">
                Faça upload de CNH, apólice, boletim e demais arquivos em um único clique.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg">
              <div className="mb-4">
                <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" /* ... */ />
              </div>
              <h3 className="font-semibold text-xl mb-2">2. Processamento Automático</h3>
              <p className="text-gray-600">
                Nosso motor de IA lê e valida cada documento em segundos.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg">
              <div className="mb-4">
                <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" /* ... */ />
              </div>
              <h3 className="font-semibold text-xl mb-2">3. Aprovação Instantânea</h3>
              <p className="text-gray-600">
                Receba o resultado final e siga diretamente para o pagamento.
              </p>
            </div>
          </div>
        </div>
      </section>

    <section className="py-16 px-6 md:px-24 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
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

      <Footer />
    </>
  );
};

export default Home;
