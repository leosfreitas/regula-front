import { useRef, useState, useEffect } from "react";
import { Footer } from "../../components/footer";
import { BlackHeader } from "../../components/blackHeader";
import { Link } from "react-router-dom";

export const About = () => {
    const statsRef = useRef<HTMLDivElement>(null);
    const [statsVisible, setStatsVisible] = useState(false);

    const [countUp, setCountUp] = useState({
        productivity: 0,
        cost: 0,
        satisfaction: 0,
        partnerships: 0,
    });
    
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

  return (
    <>
      <BlackHeader />

      <main className="w-full">
        <section className="pt-40 pb-16 px-4">
          <div className="w-[90%] mx-auto">
            <h1 className="text-4xl font-medium mb-10 text-gray-900">A Regula.ai</h1>

            <div className="w-full relative rounded-lg overflow-hidden">
              <img src="/about/bg1.png" alt="Regula.ai Banner" className="w-full h-full object-cover"/> 

              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 text-white">
                <p className="text-4xl md:text-6xl font-bold leading-tight">
                  Começamos.<br />
                  Evoluímos.<br />
                  Mudamos.<br />
                  Mas mantivemos o nosso objetivo:
                </p>
                <p className="text-2xl md:text-4xl font-bold mt-8">
                  <span className="text-yellow-500">Soluções</span><br />
                  focadas em sua<br />
                  empresa
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full border-t border-gray-200 my-4"></div>

        <section className="py-18 px-4 bg-white">
        <div className="w-[90%] mx-auto">
            <h2 className="text-4xl font-medium mb-10 text-gray-900">Nossa Trajetória</h2>

            {/* Timeline estilizada */}
            <div className="w-full relative mx-auto mt-16 mb-24">
            {/* Linha do tempo horizontal */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-blue-900 -translate-y-1/2"></div>
            
            {/* Container para os pontos da trajetória */}
            <div className="flex justify-between relative">
                {/* Ponto 2024 */}
                <div className="relative flex flex-col items-center">
                {/* Linha vertical conectando o ponto à linha principal */}
                <div className="w-0.5 h-10 bg-blue-900"></div>
                <div className="w-4 h-4 bg-blue-900 rounded-full relative z-10"></div>
                <div className="absolute top-16 text-yellow-600 font-bold text-2xl">2024</div>
                <div className="absolute top-24 w-32 text-center text-gray-700">
                    XXXXXXXXXXX
                </div>
                </div>
                
                {/* Ponto 2025 */}
                <div className="relative flex flex-col items-center">
                {/* Linha vertical conectando o ponto à linha principal */}
                <div className="w-0.5 h-10 bg-blue-900 order-last"></div>
                <div className="w-4 h-4 bg-blue-900 rounded-full relative z-10"></div>
                <div className="absolute top-16 text-yellow-600 font-bold text-2xl">2025</div>
                <div className="absolute -top-24 w-32 text-center text-gray-700">
                    XXXXXXXXXXX
                </div>
                </div>
                
                {/* Ponto 2025.2 */}
                <div className="relative flex flex-col items-center">
                {/* Linha vertical conectando o ponto à linha principal */}
                <div className="w-0.5 h-10 bg-blue-900"></div>
                <div className="w-4 h-4 bg-blue-900 rounded-full relative z-10"></div>
                <div className="absolute top-16 text-yellow-600 font-bold text-2xl">2025.2</div>
                <div className="absolute top-24 w-32 text-center text-gray-700">
                    XXXXXXXXXXX
                </div>
                </div>
            </div>
            </div>
        </div>
        </section>


        {/* Seção de Valores - margens ajustadas para combinar com outras seções */}
        <section className="py-20 px-4 bg-blue-950 text-white">
          <div className="w-[90%] mx-auto">
            <h2 className="text-4xl font-bold mb-16">Valores que guiam a empresa</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-48">
              <div>
                <h3 className="text-2xl font-semibold mb-2 border-b border-white pb-2">Inovação</h3>
                <p className="mt-6 text-lg text-justify">
                  Utilizamos inteligência artificial de forma estratégica 
                  para transformar a regulação de sinistros, 
                  antecipando tendências e entregando soluções 
                  tecnológicas de ponta ao mercado segurador.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-2 border-b border-white pb-2">Confiabilidade</h3>
                <p className="mt-6 text-lg text-justify">
                  Garantimos segurança, precisão e conformidade em 
                  cada etapa do processo. Nossas soluções seguem os 
                  mais altos padrões de proteção de dados e 
                  integridade operacional.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-2 border-b border-white pb-2">Agilidade</h3>
                <p className="mt-6 text-lg text-justify">
                  Valorizamos a eficiência e a rapidez na análise de 
                  sinistros, automatizando processos para reduzir o 
                  tempo de resposta e melhorar a experiência de 
                  seguradoras e segurados.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-18 px-4 bg-white">
          <div className="w-[90%] mx-auto">
            <h2 className="text-4xl font-medium mb-6 text-gray-900">Nossos Resultados</h2>
            <p className="text-lg md:text-2xl text-gray-700 leading-relaxed">
              A Regula.ai transforma a análise de sinistros com tecnologia de ponta,
              aumentando a eficiência e promovendo resultados reais para empresas
            </p>

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
      </main>

      <Footer />
    </>
  );
};