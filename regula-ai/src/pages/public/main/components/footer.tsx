import { MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#003666] text-white py-8 bottom-0">
      <div className="max-w mx-10 px-4 md:px-8">
        <img src="RegulaAI.png" alt="Logo Regula.ai" className="w-64 mb-8" />

        <div className="h-[1px] bg-slate-400 mt-5"></div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div>
            <h4 className="uppercase font-semibold text-s mb-4">PÁGINAS</h4>
            <ul className="space-y-4 mt-7">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">Sobre</a></li>
              <li><a href="#" className="hover:underline">Serviços</a></li>
              <li><a href="#" className="hover:underline">Contato</a></li>

                <div className="flex items-center gap-2 text-gray-200 mt-12 mb-3 ml-[-4px]">
                  <MapPin size={28} className="text-gray-200"/>
                  <span className="text-l">Rua Quatá - 200 - Vila Olímpia - São Paulo/SP</span>
                </div>
                
            </ul>
          </div>

          <div>
            <h4 className="uppercase font-semibold text-s mb-4">LINKS ÚTEIS</h4>
            <ul className="space-y-4 mt-7">
              <li><a href="#" className="hover:underline">Área do cliente</a></li>
              <li><a href="#" className="hover:underline">Receita Federal</a></li>
              <li><a href="#" className="hover:underline">LGPD</a></li>
              <li><a href="#" className="hover:underline">Guarda de Documentos</a></li>
            </ul>
          </div>

          <div>
            <h4 className="uppercase font-semibold text-s mb-4">LINKS ÚTEIS</h4>
            <ul className="space-y-4 mt-7">
              <li><a href="#" className="hover:underline">SUSEP</a></li>
              <li><a href="#" className="hover:underline">CNSeg</a></li>
              <li><a href="#" className="hover:underline">ANS</a></li>
              <li><a href="#" className="hover:underline">Denatran</a></li>
            </ul>
          </div>

          <div>
            <h4 className="uppercase font-semibold text-s mb-4">ENTRE EM CONTATO</h4>
            <form className="space-y-6">
              <input
                type="email"
                placeholder="Email"
                className="w-full h-12 p-2 text-black bg-white focus:outline-none border-2 border-gray-400"
              />
              <textarea
                placeholder="Mensagem"
                rows={4}
                className="w-full p-2 h-22 text-black bg-white focus:outline-none border-2 border-gray-400 resize-none"
              ></textarea>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#d18c00] text-white px-7 py-2 font-semibold hover:bg-[#b37700] transition duration-300 cursor-pointer rounded-sm"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>

        </div>
        <div className="h-[1px] bg-slate-400 mt-5"></div>
        <div className="max-w-screen-xl mt-7">
          Regula.ai © 2025. Todos os direitos reservados
        </div>
      </div>
    </footer>
  );
};