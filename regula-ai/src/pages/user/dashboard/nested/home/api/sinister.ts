import { config } from "@/config/config";

export interface Sinistro {
  _id: string;
  user_id: string;
  status: string;
  accident_area: string;
  sex: string;
  fault: string;
  police_report_filed: string;
  witness_present: string;
  agent_type: string;
  vehicle_price: string;
  age_of_vehicle: string;
  base_policy: string;
  age: number;
  make: string;
  month_claimed: string;
  marital_status: string;
  policy_type: string;
  vehicle_category: string;
  deductible: number;
  age_of_policy_holder: number;
  number_of_cars: number;
  days_policy_accident: string;  // NOVO
  days_policy_claim: string;     // NOVO
  data: string;
}

export interface CreateSinistroDTO {
  accident_area: string;
  sex: string;
  fault: string;
  police_report_filed: string;
  witness_present: string;
  agent_type: string;
  vehicle_price: string;
  age_of_vehicle: string;
  base_policy: string;
  age: number;
  make: string;
  month_claimed: string;
  marital_status: string;
  policy_type: string;
  vehicle_category: string;
  deductible: number;
  age_of_policy_holder: number;
  number_of_cars: number;
  days_policy_accident: string;  // NOVO
  days_policy_claim: string;     // NOVO
}

export async function getSinistros(): Promise<Sinistro[]> {
  const { apiBaseUrl } = config;
  const requestRoute = "/user/get/sinistros";

  const options = {
    method: "GET",
    credentials: "include" as RequestCredentials,
  };

  const response = await fetch(apiBaseUrl + requestRoute, options);
  if (!response.ok) {
    throw new Error("Erro ao obter sinistros");
  }
  const data = await response.json();
  console.log("Sinistros obtidos com sucesso:", data);
  return data.sinistros;
}

export async function createSinistro(
  sinistroData: CreateSinistroDTO
): Promise<{ response: Response; responseData: any }> {
  const { apiBaseUrl } = config;
  const requestRoute = "/user/sinistro/create";

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sinistroData),
    credentials: "include" as RequestCredentials,
  };

  const response = await fetch(apiBaseUrl + requestRoute, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Erro ao criar sinistro");
  }
  const responseData = await response.json();
  console.log("Sinistro criado com sucesso:", responseData);
  return { response, responseData };
}

export async function deleteSinistro(
  sinistroId: string
): Promise<{ response: Response; responseData: any }> {
  const { apiBaseUrl } = config;
  const requestRoute = `/user/sinistro/delete/${sinistroId}`;

  const options = {
    method: "DELETE",
    credentials: "include" as RequestCredentials,
  };

  const response = await fetch(apiBaseUrl + requestRoute, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Erro ao excluir sinistro");
  }

  let responseData = null;
  if (response.status !== 204) {
    responseData = await response.json().catch(() => null);
  }

  console.log("Sinistro excluído com sucesso:", responseData);
  return { response, responseData };
}