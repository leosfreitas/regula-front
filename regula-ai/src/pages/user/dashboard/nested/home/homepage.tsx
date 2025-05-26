import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  getSinistros, 
  createSinistro, 
  deleteSinistro,
  Sinistro,
  CreateSinistroDTO 
} from "./api/sinister";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogOverlay } from "@/components/ui/dialog";
import { Info, ChevronRight, ChevronLeft, Car, FileText, User, Shield } from "lucide-react";

export const Home = () => {
  const [sinistros, setSinistros] = useState<Sinistro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSinistroId, setSelectedSinistroId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    accident_area: "",
    sex: "",
    fault: "",
    police_report_filed: "",
    witness_present: "",
    agent_type: "",
    vehicle_price_br: "",
    age_of_vehicle: "",
    base_policy: "",
    age: "",
    make: "",
    month_claimed: "",
    marital_status: "",
    policy_type: "",
    vehicle_category: "",
    deductible_br: "",
    age_of_policy_holder: "",
    number_of_cars: "",
    days_policy_accident: "", // NOVO
    days_policy_claim: ""     // NOVO
  });

  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    loadSinistros();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadSinistros = async () => {
    try {
      setIsLoading(true);
      const data = await getSinistros();
      setSinistros(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      setError("Não foi possível carregar os sinistros. Por favor, tente novamente.");
      console.error("Erro ao carregar sinistros:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateStep = (step: number): boolean => {
    const errors: {[key: string]: string} = {};

    switch (step) {
      case 1:
        if (!formData.accident_area) errors.accident_area = "Campo obrigatório";
        if (!formData.fault) errors.fault = "Campo obrigatório";
        if (!formData.police_report_filed) errors.police_report_filed = "Campo obrigatório";
        if (!formData.witness_present) errors.witness_present = "Campo obrigatório";
        if (!formData.agent_type) errors.agent_type = "Campo obrigatório";
        if (!formData.month_claimed) errors.month_claimed = "Campo obrigatório";
        break;
      case 2:
        if (!formData.make) errors.make = "Campo obrigatório";
        if (!formData.vehicle_category) errors.vehicle_category = "Campo obrigatório";
        if (!formData.vehicle_price_br) errors.vehicle_price_br = "Campo obrigatório";
        if (!formData.age_of_vehicle) errors.age_of_vehicle = "Campo obrigatório";
        if (!formData.number_of_cars) errors.number_of_cars = "Campo obrigatório";
        break;
      case 3:
        if (!formData.sex) errors.sex = "Campo obrigatório";
        if (!formData.age) errors.age = "Campo obrigatório";
        if (!formData.marital_status) errors.marital_status = "Campo obrigatório";
        if (!formData.age_of_policy_holder) errors.age_of_policy_holder = "Campo obrigatório";
        break;
      case 4:
        if (!formData.base_policy) errors.base_policy = "Campo obrigatório";
        if (!formData.policy_type) errors.policy_type = "Campo obrigatório";
        if (!formData.deductible_br) errors.deductible_br = "Campo obrigatório";
        if (!formData.days_policy_accident) errors.days_policy_accident = "Campo obrigatório"; // NOVO
        if (!formData.days_policy_claim) errors.days_policy_claim = "Campo obrigatório";       // NOVO
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const convertToEnglishValues = (): CreateSinistroDTO => {
    const vehiclePriceMap: {[key: string]: string} = {
      "menos de 100000": "less than 20000",
      "100000 a 145000": "20000 to 29000",
      "150000 a 195000": "30000 to 39000",
      "200000 a 295000": "40000 to 59000",
      "300000 a 345000": "60000 to 69000",
      "mais de 345000": "more than 69000"
    };

    const ageOfVehicleMap: {[key: string]: string} = {
      "novo": "new",
      "2 anos": "2 years",
      "3 anos": "3 years",
      "4 anos": "4 years",
      "5 anos": "5 years",
      "6 anos": "6 years",
      "7 anos": "7 years",
      "mais de 7 anos": "more than 7"
    };

    const monthMap: {[key: string]: string} = {
      "Janeiro": "Jan",
      "Fevereiro": "Feb",
      "Março": "Mar",
      "Abril": "Apr",
      "Maio": "May",
      "Junho": "Jun",
      "Julho": "Jul",
      "Agosto": "Aug",
      "Setembro": "Sep",
      "Outubro": "Oct",
      "Novembro": "Nov",
      "Dezembro": "Dec"
    };

    const daysPolicyMap: {[key: string]: string} = {
    "Nenhum": "none",
    "1 a 7 dias": "1 to 7",
    "8 a 15 dias": "8 to 15", 
    "15 a 30 dias": "15 to 30",
    "Mais de 30 dias": "more than 30"
  };

    const maritalStatusMap: {[key: string]: string} = {
      "Solteiro(a)": "Single",
      "Casado(a)": "Married",
      "Viúvo(a)": "Widow",
      "Divorciado(a)": "Divorced"
    };

    const basePolicyMap: {[key: string]: string} = {
      "Responsabilidade Civil": "Liability",
      "Colisão": "Collision",
      "Todos os Riscos": "All Perils"
    };

    const convertedDeductible = Math.floor(parseInt(formData.deductible_br) / 5);

    return {
      accident_area: formData.accident_area === "Urbana" ? "Urban" : "Rural",
      sex: formData.sex === "Masculino" ? "Male" : "Female",
      fault: formData.fault === "Titular da Apólice" ? "Policy Holder" : "Third Party",
      police_report_filed: formData.police_report_filed === "Sim" ? "Yes" : "No",
      witness_present: formData.witness_present === "Sim" ? "Yes" : "No",
      agent_type: formData.agent_type === "Externo" ? "External" : "Internal",
      vehicle_price: vehiclePriceMap[formData.vehicle_price_br],
      age_of_vehicle: ageOfVehicleMap[formData.age_of_vehicle],
      base_policy: basePolicyMap[formData.base_policy],
      age: parseInt(formData.age),
      make: formData.make,
      month_claimed: monthMap[formData.month_claimed],
      marital_status: maritalStatusMap[formData.marital_status],
      policy_type: formData.policy_type,
      vehicle_category: formData.vehicle_category,
      deductible: convertedDeductible,
      age_of_policy_holder: parseInt(formData.age_of_policy_holder),
      number_of_cars: parseInt(formData.number_of_cars),
      days_policy_accident: daysPolicyMap[formData.days_policy_accident], 
      days_policy_claim: daysPolicyMap[formData.days_policy_claim] // NOVO
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const convertedData = convertToEnglishValues();
      await createSinistro(convertedData);
      
      setFormData({
        accident_area: "",
        sex: "",
        fault: "",
        police_report_filed: "",
        witness_present: "",
        agent_type: "",
        vehicle_price_br: "",
        age_of_vehicle: "",
        base_policy: "",
        age: "",
        make: "",
        month_claimed: "",
        marital_status: "",
        policy_type: "",
        vehicle_category: "",
        deductible_br: "",
        age_of_policy_holder: "",
        number_of_cars: "",
        days_policy_accident: "", // NOVO
        days_policy_claim: ""     // NOVO
      });
      
      setIsCreateDialogOpen(false);
      setCurrentStep(1);
      setSuccessMessage("Sinistro registrado com sucesso!");
      
      await loadSinistros();
      
    } catch (err: any) {
      setError(err.message || "Erro ao criar sinistro");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (sinistroId: string) => {
    setSelectedSinistroId(sinistroId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSinistroId) {
      console.error("Nenhum ID de sinistro selecionado para exclusão");
      setError("Erro ao excluir: ID de sinistro não encontrado");
      return;
    }
    
    try {
      setIsDeleting(true);
      setError(null);
      
      await deleteSinistro(selectedSinistroId);
      
      setIsDeleteDialogOpen(false);
      setSelectedSinistroId(null);
      setSuccessMessage("Sinistro excluído com sucesso!");
      
      await loadSinistros();
    } catch (err: any) {
      console.error("Erro ao excluir sinistro:", err);
      setError(err.message || "Erro ao excluir sinistro");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ABERTO":
        return "bg-blue-100 text-blue-800";
      case "EM ANÁLISE":
      case "EM ANALISE":
        return "bg-yellow-100 text-yellow-800";
      case "NEGADO":
        return "bg-red-100 text-red-800";
      case "APROVADO":
        return "bg-green-100 text-green-800";
      case "PAGO":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => (
    <div className="relative inline-block group">
      {children}
      <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-sm rounded-lg p-2 w-64 -top-2 left-8">
        {text}
        <div className="absolute w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-gray-800 -left-[6px] top-3"></div>
      </div>
    </div>
  );

  const handleOpenCreateDialog = () => {
    setFormData({
      accident_area: "",
      sex: "",
      fault: "",
      police_report_filed: "",
      witness_present: "",
      agent_type: "",
      vehicle_price_br: "",
      age_of_vehicle: "",
      base_policy: "",
      age: "",
      make: "",
      month_claimed: "",
      marital_status: "",
      policy_type: "",
      vehicle_category: "",
      deductible_br: "",
      age_of_policy_holder: "",
      number_of_cars: "",
      days_policy_accident: "",
      days_policy_claim: ""
    });
    setCurrentStep(1);
    setFormErrors({});
    setIsCreateDialogOpen(true);
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, title: "Acidente", icon: <FileText className="w-4 h-4" /> },
      { number: 2, title: "Veículo", icon: <Car className="w-4 h-4" /> },
      { number: 3, title: "Motorista", icon: <User className="w-4 h-4" /> },
      { number: 4, title: "Seguro", icon: <Shield className="w-4 h-4" /> }
    ];

    return (
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= step.number ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
            }`}>
              {step.icon}
            </div>
            <div className="ml-2">
              <p className={`text-sm font-medium ${
                currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-full h-0.5 ml-2 ${
                currentStep > step.number ? 'bg-blue-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Informações do Acidente</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-gray-700 text-sm font-bold mb-2">
                  Área do Acidente
                  <Tooltip text="Local onde ocorreu o acidente: área urbana (cidade) ou rural (campo/estrada)">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </Tooltip>
                </label>
                <select
                  name="accident_area"
                  value={formData.accident_area}
                  onChange={handleInputChange}
                  className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.accident_area ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Selecione...</option>
                  <option value="Urbana">Urbana</option>
                  <option value="Rural">Rural</option>
                </select>
                {formErrors.accident_area && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.accident_area}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 text-sm font-bold mb-2">
                  Culpa do Acidente
                  <Tooltip text="Quem foi responsável pelo acidente: o titular da apólice ou terceiros">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </Tooltip>
                </label>
                <select
                  name="fault"
                  value={formData.fault}
                  onChange={handleInputChange}
                  className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.fault ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Selecione...</option>
                  <option value="Titular da Apólice">Titular da Apólice</option>
                  <option value="Terceiros">Terceiros</option>
                </select>
                {formErrors.fault && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.fault}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 text-sm font-bold mb-2">
                  Boletim de Ocorrência
                  <Tooltip text="Se foi registrado boletim de ocorrência policial">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </Tooltip>
                </label>
                <select
                  name="police_report_filed"
                  value={formData.police_report_filed}
                  onChange={handleInputChange}
                  className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.police_report_filed ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Selecione...</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
                {formErrors.police_report_filed && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.police_report_filed}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 text-sm font-bold mb-2">
                  Testemunhas Presentes
                  <Tooltip text="Se havia testemunhas no momento do acidente">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </Tooltip>
                </label>
                <select
                  name="witness_present"
                  value={formData.witness_present}
                  onChange={handleInputChange}
                  className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.witness_present ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Selecione...</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
                {formErrors.witness_present && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.witness_present}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 text-sm font-bold mb-2">
                  Tipo de Agente
                  <Tooltip text="Se o agente que atendeu é funcionário da seguradora (interno) ou terceirizado (externo)">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </Tooltip>
                </label>
                <select
                  name="agent_type"
                  value={formData.agent_type}
                  onChange={handleInputChange}
                  className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.agent_type ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Selecione...</option>
                  <option value="Externo">Externo</option>
                  <option value="Interno">Interno</option>
                </select>
                {formErrors.agent_type && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.agent_type}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 text-sm font-bold mb-2">
                  Mês do Sinistro
                  <Tooltip text="Mês em que ocorreu o acidente">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </Tooltip>
                </label>
                <select
                  name="month_claimed"
                  value={formData.month_claimed}
                  onChange={handleInputChange}
                  className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.month_claimed ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Selecione...</option>
                  <option value="Janeiro">Janeiro</option>
                  <option value="Fevereiro">Fevereiro</option>
                  <option value="Março">Março</option>
                  <option value="Abril">Abril</option>
                  <option value="Maio">Maio</option>
                  <option value="Junho">Junho</option>
                  <option value="Julho">Julho</option>
                  <option value="Agosto">Agosto</option>
                  <option value="Setembro">Setembro</option>
                  <option value="Outubro">Outubro</option>
                  <option value="Novembro">Novembro</option>
                  <option value="Dezembro">Dezembro</option>
                </select>
                {formErrors.month_claimed && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.month_claimed}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Informações do Veículo</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-gray-700 text-sm font-bold mb-2">
                  Marca do Veículo
                  <Tooltip text="Fabricante do veículo (ex: Honda, Toyota, Ford)">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </Tooltip>
                </label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  placeholder="Ex: Honda, Toyota, Ford"
                  className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.make ? 'border-red-500' : ''
                  }`}
                />
                {formErrors.make && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.make}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 text-sm font-bold mb-2">
                  Categoria do Veículo
                  <Tooltip text="Tipo de carroceria do veículo">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </Tooltip>
                </label>
                <select
                  name="vehicle_category"
                  value={formData.vehicle_category}
                  onChange={handleInputChange}
                  className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.vehicle_category ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Selecione...</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Sport">Sport</option>
                  <option value="Utility">Utility</option>
                </select>
                {formErrors.vehicle_category && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.vehicle_category}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 text-sm font-bold mb-2">
                  Valor do Veículo (R$)
                  <Tooltip text="Valor aproximado do veículo em reais">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </Tooltip>
                </label>
                <select
                  name="vehicle_price_br"
                  value={formData.vehicle_price_br}
                  onChange={handleInputChange}
                  className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.vehicle_price_br ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Selecione...</option>
                  <option value="menos de 100000">Menos de R$ 100.000</option>
                  <option value="100000 a 145000">R$ 100.000 a R$ 145.000</option>
                  <option value="150000 a 195000">R$ 150.000 a R$ 195.000</option>
                  <option value="200000 a 295000">R$ 200.000 a R$ 295.000</option>
                  <option value="300000 a 345000">R$ 300.000 a R$ 345.000</option>
                  <option value="mais de 345000">Mais de R$ 345.000</option>
                </select>
                {formErrors.vehicle_price_br && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.vehicle_price_br}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 text-sm font-bold mb-2">
                  Idade do Veículo
                  <Tooltip text="Quantos anos tem o veículo desde a fabricação">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </Tooltip>
                </label>
                <select
                  name="age_of_vehicle"
                  value={formData.age_of_vehicle}
                  onChange={handleInputChange}
                  className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.age_of_vehicle ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Selecione...</option>
                  <option value="novo">Novo (0 km)</option>
                  <option value="2 anos">2 anos</option>
                  <option value="3 anos">3 anos</option>
                  <option value="4 anos">4 anos</option>
                  <option value="5 anos">5 anos</option>
                  <option value="6 anos">6 anos</option>
                  <option value="7 anos">7 anos</option>
                  <option value="mais de 7 anos">Mais de 7 anos</option>
                </select>
                {formErrors.age_of_vehicle && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.age_of_vehicle}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 text-sm font-bold mb-2">
                  Número de Carros
                  <Tooltip text="Quantidade de veículos que o titular possui (1 a 3)">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </Tooltip>
                </label>
                <input
                  type="number"
                  name="number_of_cars"
                  value={formData.number_of_cars}
                  onChange={handleInputChange}
                  min="1"
                  max="3"
                  className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.number_of_cars ? 'border-red-500' : ''
                  }`}
                />
                {formErrors.number_of_cars && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.number_of_cars}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Informações do Motorista</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-gray-700 text-sm font-bold mb-2">
                  Sexo do Motorista
                  <Tooltip text="Sexo do motorista envolvido no acidente">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </Tooltip>
                </label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.sex ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Selecione...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
                {formErrors.sex && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.sex}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 text-sm font-bold mb-2">
                  Idade do Motorista
                  <Tooltip text="Idade do motorista no momento do acidente (mínimo 17 anos)">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </Tooltip>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="17"
                  className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.age ? 'border-red-500' : ''
                  }`}
                />
                {formErrors.age && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.age}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 text-sm font-bold mb-2">
                  Estado Civil
                  <Tooltip text="Estado civil do titular da apólice">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </Tooltip>
                </label>
                <select
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={handleInputChange}
                  className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.marital_status ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Selecione...</option>
                  <option value="Solteiro(a)">Solteiro(a)</option>
                  <option value="Casado(a)">Casado(a)</option>
                  <option value="Viúvo(a)">Viúvo(a)</option>
                  <option value="Divorciado(a)">Divorciado(a)</option>
                </select>
                {formErrors.marital_status && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.marital_status}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 text-sm font-bold mb-2">
                  Idade do Titular da Apólice
                  <Tooltip text="Idade da pessoa que contratou o seguro (mínimo 17 anos)">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </Tooltip>
                </label>
                <input
                  type="number"
                  name="age_of_policy_holder"
                  value={formData.age_of_policy_holder}
                  onChange={handleInputChange}
                  min="17"
                  className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.age_of_policy_holder ? 'border-red-500' : ''
                  }`}
                />
                {formErrors.age_of_policy_holder && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.age_of_policy_holder}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Informações do Seguro</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-gray-700 text-sm font-bold mb-2">
                  Tipo de Cobertura
                  <Tooltip text="Tipo de cobertura do seguro contratado">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </Tooltip>
                </label>
                <select
                  name="base_policy"
                  value={formData.base_policy}
                  onChange={handleInputChange}
                  className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.base_policy ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Selecione...</option>
                  <option value="Responsabilidade Civil">Responsabilidade Civil</option>
                  <option value="Colisão">Colisão</option>
                  <option value="Todos os Riscos">Todos os Riscos</option>
                </select>
                {formErrors.base_policy && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.base_policy}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 text-sm font-bold mb-2">
                  Tipo de Apólice
                  <Tooltip text="Nome específico da apólice contratada (ex: Sedan - Liability)">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </Tooltip>
                </label>
                <input
                  type="text"
                  name="policy_type"
                  value={formData.policy_type}
                  onChange={handleInputChange}
                  placeholder="Ex: Sedan - Liability"
                  className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.policy_type ? 'border-red-500' : ''
                  }`}
                />
                {formErrors.policy_type && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.policy_type}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 text-sm font-bold mb-2">
                  Franquia (R$)
                  <Tooltip text="Valor da franquia em reais (geralmente R$ 1.500, R$ 2.000, R$ 3.000)">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </Tooltip>
                </label>
                <input
                  type="number"
                  name="deductible_br"
                  value={formData.deductible_br}
                  onChange={handleInputChange}
                  placeholder="Ex: 1500, 2000, 3000"
                  className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.deductible_br ? 'border-red-500' : ''
                  }`}
                />
                {formErrors.deductible_br && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.deductible_br}</p>
                )}
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-gray-700 text-sm font-bold mb-2">
                Dias entre Apólice e Acidente
                <Tooltip text="Quantos dias se passaram entre a contratação da apólice e o acidente">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                </Tooltip>
              </label>
              <select
                name="days_policy_accident"
                value={formData.days_policy_accident}
                onChange={handleInputChange}
                className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.days_policy_accident ? 'border-red-500' : ''
                }`}
              >
                <option value="">Selecione...</option>
                <option value="Nenhum">Nenhum</option>
                <option value="1 a 7 dias">1 a 7 dias</option>
                <option value="8 a 15 dias">8 a 15 dias</option>
                <option value="15 a 30 dias">15 a 30 dias</option>
                <option value="Mais de 30 dias">Mais de 30 dias</option>
              </select>
              {formErrors.days_policy_accident && (
                <p className="text-red-500 text-xs mt-1">{formErrors.days_policy_accident}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 text-sm font-bold mb-2">
                Dias entre Apólice e Sinistro
                <Tooltip text="Quantos dias se passaram entre a contratação da apólice e o registro do sinistro">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                </Tooltip>
              </label>
              <select
                name="days_policy_claim"
                value={formData.days_policy_claim}
                onChange={handleInputChange}
                className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.days_policy_claim ? 'border-red-500' : ''
                }`}
              >
                <option value="">Selecione...</option>
                <option value="Nenhum">Nenhum</option>
                <option value="1 a 7 dias">1 a 7 dias</option>
                <option value="8 a 15 dias">8 a 15 dias</option>
                <option value="15 a 30 dias">15 a 30 dias</option>
                <option value="Mais de 30 dias">Mais de 30 dias</option>
              </select>
              {formErrors.days_policy_claim && (
                <p className="text-red-500 text-xs mt-1">{formErrors.days_policy_claim}</p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[80vh] px-4 w-full py-8">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Meus Sinistros</h1>
          <button
            onClick={handleOpenCreateDialog}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded cursor-pointer"
          >
            Novo Sinistro
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded mb-6">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded mb-6">
            {successMessage}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : sinistros.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl mb-4">Você não possui sinistros registrados.</p>
            <button
              onClick={handleOpenCreateDialog}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded cursor-pointer"
            >
              Registrar Primeiro Sinistro
            </button>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200">
            <div className="h-96 overflow-auto">
              <table className="min-w-full bg-white">
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr className="text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-4 px-6 text-left">ID</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-left">Data</th>
                    <th className="py-4 px-6 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-base">
                  {sinistros.map((sinistro) => (
                    <tr key={sinistro._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium">{sinistro._id.slice(-8)}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(sinistro.status)}`}>
                          {sinistro.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">{formatDate(sinistro.data)}</td>
                      <td className="py-4 px-6 text-center">
                        <button 
                          onClick={() => handleDeleteClick(sinistro._id)}
                          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors cursor-pointer"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogOverlay className="bg-black/50 fixed inset-0" />
        <DialogContent className="max-w-3xl bg-white rounded-lg shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 z-50 border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Registrar Novo Sinistro</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="mt-4">
            {renderStepIndicator()}
            
            <div className="min-h-[400px]">
              {renderFormStep()}
            </div>

            <DialogFooter className="flex justify-between mt-6">
              <div className="flex gap-2">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </button>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setCurrentStep(1);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded cursor-pointer"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer"
                  >
                    Próximo
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full mr-2"></div>
                        <span>Enviando...</span>
                      </div>
                    ) : (
                      "Registrar Sinistro"
                    )}
                  </button>
                )}
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogOverlay className="bg-black/50 fixed inset-0" />
        <DialogContent className="max-w-md bg-white rounded-lg shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 z-50 border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          
          <p className="text-gray-700 my-6">
            Tem certeza que deseja excluir este sinistro? Esta ação não pode ser desfeita.
          </p>
          
          <DialogFooter className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedSinistroId(null);
              }}
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded cursor-pointer"
              disabled={isDeleting}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full mr-2"></div>
                  <span>Excluindo...</span>
                </div>
              ) : (
                "Confirmar Exclusão"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};