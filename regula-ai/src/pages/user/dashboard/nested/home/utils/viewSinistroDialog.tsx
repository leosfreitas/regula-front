import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogOverlay } from "@/components/ui/dialog";
import { Car, FileText, User, Shield, X } from "lucide-react";
import { Sinistro } from "../api/sinister";

interface ViewSinistroDialogProps {
  isOpen: boolean;
  sinistro: Sinistro | null;
  onClose: () => void;
}

export const ViewSinistroDialog = ({ isOpen, sinistro, onClose }: ViewSinistroDialogProps) => {
  if (!sinistro) return null;

  const convertToPortuguese = (sinistro: Sinistro) => {
    const areaMap: {[key: string]: string} = {
      "Urban": "Urbana",
      "Rural": "Rural"
    };

    const sexMap: {[key: string]: string} = {
      "Male": "Masculino",
      "Female": "Feminino"
    };

    const faultMap: {[key: string]: string} = {
      "Policy Holder": "Titular da Apólice",
      "Third Party": "Terceiros"
    };

    const yesNoMap: {[key: string]: string} = {
      "Yes": "Sim",
      "No": "Não"
    };

    const agentMap: {[key: string]: string} = {
      "External": "Externo",
      "Internal": "Interno"
    };

    const vehiclePriceMap: {[key: string]: string} = {
      "less than 20000": "Menos de R$ 100.000",
      "20000 to 29000": "R$ 100.000 a R$ 145.000",
      "30000 to 39000": "R$ 150.000 a R$ 195.000",
      "40000 to 59000": "R$ 200.000 a R$ 295.000",
      "60000 to 69000": "R$ 300.000 a R$ 345.000",
      "more than 69000": "Mais de R$ 345.000"
    };

    const ageOfVehicleMap: {[key: string]: string} = {
      "new": "Novo (0 km)",
      "2 years": "2 anos",
      "3 years": "3 anos",
      "4 years": "4 anos",
      "5 years": "5 anos",
      "6 years": "6 anos",
      "7 years": "7 anos",
      "more than 7": "Mais de 7 anos"
    };

    const basePolicyMap: {[key: string]: string} = {
      "Liability": "Responsabilidade Civil",
      "Collision": "Colisão",
      "All Perils": "Todos os Riscos"
    };

    const maritalStatusMap: {[key: string]: string} = {
      "Single": "Solteiro(a)",
      "Married": "Casado(a)",
      "Widow": "Viúvo(a)",
      "Divorced": "Divorciado(a)"
    };

    const daysPolicyMap: {[key: string]: string} = {
      "none": "Nenhum",
      "1 to 7": "1 a 7 dias",
      "8 to 15": "8 a 15 dias",
      "15 to 30": "15 a 30 dias",
      "more than 30": "Mais de 30 dias"
    };

    return {
      area: areaMap[sinistro.accident_area] || sinistro.accident_area,
      sexo: sexMap[sinistro.sex] || sinistro.sex,
      culpa: faultMap[sinistro.fault] || sinistro.fault,
      boletim: yesNoMap[sinistro.police_report_filed] || sinistro.police_report_filed,
      testemunhas: yesNoMap[sinistro.witness_present] || sinistro.witness_present,
      agente: agentMap[sinistro.agent_type] || sinistro.agent_type,
      valorVeiculo: vehiclePriceMap[sinistro.vehicle_price] || sinistro.vehicle_price,
      idadeVeiculo: ageOfVehicleMap[sinistro.age_of_vehicle] || sinistro.age_of_vehicle,
      cobertura: basePolicyMap[sinistro.base_policy] || sinistro.base_policy,
      estadoCivil: maritalStatusMap[sinistro.marital_status] || sinistro.marital_status,
      diasApoliceAcidente: daysPolicyMap[sinistro.days_policy_accident] || sinistro.days_policy_accident,
      diasApoliceSinistro: daysPolicyMap[sinistro.days_policy_claim] || sinistro.days_policy_claim,
      franquia: (sinistro.deductible * 5).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    };
  };

  const convertedData = convertToPortuguese(sinistro);

  const InfoCard = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-blue-500 text-white p-2 rounded-lg">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {children}
      </div>
    </div>
  );

  const InfoItem = ({ label, value }: { label: string; value: string | number }) => (
    <div>
      <span className="text-sm font-medium text-gray-600">{label}:</span>
      <p className="text-gray-900 font-medium">{value}</p>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/50 fixed inset-0" />
      <DialogContent className="max-w-4xl bg-white rounded-lg shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 z-50 border border-gray-200 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">
            Detalhes do Sinistro - {sinistro._id.slice(-8)}
          </DialogTitle>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>
        
        <div className="mt-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              sinistro.status.toUpperCase() === "ABERTO" ? "bg-blue-100 text-blue-800" :
              sinistro.status.toUpperCase() === "EM ANÁLISE" || sinistro.status.toUpperCase() === "EM ANALISE" ? "bg-yellow-100 text-yellow-800" :
              sinistro.status.toUpperCase() === "NEGADO" ? "bg-red-100 text-red-800" :
              sinistro.status.toUpperCase() === "APROVADO" ? "bg-green-100 text-green-800" :
              sinistro.status.toUpperCase() === "PAGO" ? "bg-purple-100 text-purple-800" :
              "bg-gray-100 text-gray-800"
            }`}>
              Status: {sinistro.status}
            </span>
          </div>

          <InfoCard title="Informações do Acidente" icon={<FileText className="w-5 h-5" />}>
            <InfoItem label="Área do Acidente" value={convertedData.area} />
            <InfoItem label="Culpa do Acidente" value={convertedData.culpa} />
            <InfoItem label="Boletim de Ocorrência" value={convertedData.boletim} />
            <InfoItem label="Testemunhas Presentes" value={convertedData.testemunhas} />
            <InfoItem label="Tipo de Agente" value={convertedData.agente} />
            <div></div>
          </InfoCard>

          <InfoCard title="Informações do Veículo" icon={<Car className="w-5 h-5" />}>
            <InfoItem label="Marca do Veículo" value={sinistro.make} />
            <InfoItem label="Categoria do Veículo" value={sinistro.vehicle_category} />
            <InfoItem label="Valor do Veículo" value={convertedData.valorVeiculo} />
            <InfoItem label="Idade do Veículo" value={convertedData.idadeVeiculo} />
            <InfoItem label="Número de Carros" value={sinistro.number_of_cars} />
            <div></div>
          </InfoCard>

          <InfoCard title="Informações do Motorista" icon={<User className="w-5 h-5" />}>
            <InfoItem label="Sexo do Motorista" value={convertedData.sexo} />
            <InfoItem label="Idade do Motorista" value={`${sinistro.age} anos`} />
            <InfoItem label="Estado Civil" value={convertedData.estadoCivil} />
            <InfoItem label="Idade do Titular da Apólice" value={`${sinistro.age_of_policy_holder} anos`} />
          </InfoCard>

          <InfoCard title="Informações do Seguro" icon={<Shield className="w-5 h-5" />}>
            <InfoItem label="Tipo de Cobertura" value={convertedData.cobertura} />
            <InfoItem label="Tipo de Apólice" value={sinistro.policy_type} />
            <InfoItem label="Franquia" value={convertedData.franquia} />
            <InfoItem label="Dias entre Apólice e Acidente" value={convertedData.diasApoliceAcidente} />
            <InfoItem label="Dias entre Apólice e Sinistro" value={convertedData.diasApoliceSinistro} />
            <div></div>
          </InfoCard>
        </div>

        <DialogFooter className="flex justify-end mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded cursor-pointer"
          >
            Fechar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};