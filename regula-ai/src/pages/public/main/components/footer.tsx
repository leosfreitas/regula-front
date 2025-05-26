import { MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createContact } from "../nested/contact/api/contact";

export const Footer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    mensagem: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createContact({
        nome: "",
        email: formData.email,
        telefone: "",
        empresa: "",
        mensagem: formData.mensagem
      });
      toast.success("Mensagem enviada com sucesso!");
      setFormData({ email: "", mensagem: "" });
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast.error("Erro ao enviar o formulário. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#003666] text-white py-8 bottom-0">
      <div className="max-w mx-10 px-4 md:px-8">
        <img src="RegulaAI.png" alt="Logo Regula.ai" className="w-64 mb-8" />

        <div className="h-[1px] bg-slate-400 mt-5"></div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div>
            <h4 className="uppercase font-semibold text-s mb-4">PÁGINAS</h4>
            <ul className="space-y-4 mt-7">
              <li><button onClick={() => navigate("/")} className="hover:underline cursor-pointer">Home</button></li>
              <li><button onClick={() => navigate("/about")} className="hover:underline cursor-pointer">Sobre</button></li>
              <li><button onClick={() => navigate("/services")} className="hover:underline cursor-pointer">Serviços</button></li>
              <li><button onClick={() => navigate("/contact")} className="hover:underline cursor-pointer">Contato</button></li>

                <div className="flex items-center gap-2 text-gray-200 mt-12 mb-3 ml-[-4px]">
                  <MapPin size={28} className="text-gray-200"/>
                  <span className="text-l">Rua Quatá - 200 - Vila Olímpia - São Paulo/SP</span>
                </div>
                
            </ul>
          </div>

          <div>
            <h4 className="uppercase font-semibold text-s mb-4">LINKS ÚTEIS</h4>
            <ul className="space-y-4 mt-7">
              <li><button onClick={() => navigate("/client-area")} className="hover:underline cursor-pointer">Área do cliente</button></li>
              <li><a href="https://www.gov.br/receitafederal/pt-br" target="_blank" rel="noopener noreferrer" className="hover:underline cursor-pointer">Receita Federal</a></li>
              <li><button onClick={() => navigate("/lgpd")} className="hover:underline cursor-pointer">LGPD</button></li>
              <li><button onClick={() => navigate("/document-storage")} className="hover:underline cursor-pointer">Guarda de Documentos</button></li>
            </ul>
          </div>

          <div>
            <h4 className="uppercase font-semibold text-s mb-4">LINKS ÚTEIS</h4>
            <ul className="space-y-4 mt-7">
              <li><a href="https://www.susep.gov.br" target="_blank" rel="noopener noreferrer" className="hover:underline cursor-pointer">SUSEP</a></li>
              <li><a href="https://cnseg.org.br" target="_blank" rel="noopener noreferrer" className="hover:underline cursor-pointer">CNSeg</a></li>
              <li><a href="https://www.ans.gov.br" target="_blank" rel="noopener noreferrer" className="hover:underline cursor-pointer">ANS</a></li>
              <li><a href="https://www.gov.br/infraestrutura/pt-br/assuntos/transito/denatran" target="_blank" rel="noopener noreferrer" className="hover:underline cursor-pointer">Denatran</a></li>
            </ul>
          </div>

          <div>
            <h4 className="uppercase font-semibold text-s mb-4">ENTRE EM CONTATO</h4>
            <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="w-full h-12 p-2 text-black bg-white focus:outline-none border-2 border-gray-400"
                />
                <textarea
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  placeholder="Mensagem"
                  rows={4}
                  required
                  className="w-full p-2 h-22 text-black bg-white focus:outline-none border-2 border-gray-400 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#d18c00] text-white px-7 py-2 font-semibold hover:bg-[#b37700] transition duration-300 cursor-pointer rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="inline-flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                      </span>
                    ) : (
                      "Enviar"
                    )}
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