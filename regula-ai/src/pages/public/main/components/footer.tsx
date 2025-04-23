export const Footer = () => {
  return (
    <footer className="bg-[#0D2C40] text-white py-16 md:py-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 px-8 md:px-0">
        {/* Regula.ai Section */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold mb-8">Regula.ai</h3>
          <p className="text-base md:text-xl leading-relaxed">
            A Regula.ai é uma startup de inteligência artificial focada em automatizar a regulação de sinistros. 
            Usamos tecnologia de ponta para garantir mais agilidade, precisão e segurança para seguradoras e seus clientes.
          </p>
        </div>

        {/* Contato Section */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold mb-8">Entre em Contato</h3>
          <p className="text-base md:text-xl">+55 11 99999-1234</p>
          <p className="text-base md:text-xl">contato@regula.ai</p>
        </div>

        {/* Sede Section */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold mb-8">Localização</h3>
          <p className="text-base md:text-xl">
            Escritório localizado em São Paulo, SP
          </p>
        </div>

        {/* Soluções Section */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold mb-8">Nossas Soluções</h3>
          <ul className="text-base md:text-xl space-y-6">
            <li>Automação de sinistros</li>
            <li>Regulação com IA</li>
            <li>Plataforma SaaS</li>
            <li>Segurança jurídica</li>
          </ul>
        </div>

        {/* Privacidade Section */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold mb-8">Privacidade</h3>
          <ul className="text-base md:text-xl space-y-6">
            <li>
              <a href="#" className="hover:underline">
                Termos de Uso
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Centro de Privacidade
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Política de Privacidade
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center text-sm md:text-xl text-gray-400 mt-16 md:mt-20">
        © 2025 Regula.ai | Todos os direitos reservados
      </div>
    </footer>
  );
};