import { Header } from "../../components/header";
import { Footer } from "../../components/footer";

export const Home = () => {
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
          <div className="max-w-5xl px-8 md:px-24 text-left">
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

      <section className="py-30 px-6 md:px-24 bg-white text-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Regula.ai</h2>
          <p className="text-lg md:text-xl leading-relaxed mb-4">
            A Regula.ai transforma a regulação de sinistros com tecnologia de ponta para que seguradoras operem com mais agilidade, precisão e economia. Combinando inteligência artificial e expertise no setor, oferecemos soluções automatizadas que reduzem fraudes, aceleram análises e melhoram a experiência do cliente. Acreditamos que a automação é chave para uma regulação mais estratégica, capaz de antecipar riscos e gerar decisões mais assertivas. Conte com uma solução moderna, segura e adaptável às necessidades do seu negócio.
          </p>
          <p className="text-gray-500 mt-2 mb-12 cursor-pointer hover:underline">Saiba mais &gt;</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-blue-900">+50%</p>
              <p className="text-gray-700">Produtividade</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-blue-900">38%</p>
              <p className="text-gray-700">Diminuição dos gastos</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-blue-900">+20%</p>
              <p className="text-gray-700">Satisfação dos clientes</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-blue-900">+10</p>
              <p className="text-gray-700">Parcerias</p>
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

      <section className="py-30 px-6 md:px-24 bg-white text-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Parte da solução</h2>
          <p className="text-lg md:text-xl leading-relaxed mb-4">
            A Regula.ai oferece soluções inovadoras para a regulação de sinistros, utilizando inteligência artificial para otimizar processos e garantir resultados precisos. Nossos serviços incluem automação de sinistros, análise preditiva, gestão de riscos e suporte especializado. Com tecnologia avançada e uma equipe de especialistas, transformamos a regulação em uma experiência ágil e eficiente.
          </p>
          <p className="text-gray-500 mt-2 mb-12 cursor-pointer hover:underline">Saiba mais &gt;</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Automação de Sinistros</h3>
              <p className="text-gray-700">Acelere o processo de regulação com nossa solução automatizada.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Análise Preditiva</h3>
              <p className="text-gray-700">Antecipe riscos e tome decisões mais assertivas com nossa análise preditiva.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Gestão de Riscos</h3>
              <p className="text-gray-700">Identifique e gerencie riscos de forma eficaz com nossa plataforma.</p>
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
