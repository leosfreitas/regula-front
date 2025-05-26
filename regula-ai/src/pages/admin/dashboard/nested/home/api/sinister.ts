import { config } from "@/config/config";

export interface Sinistro {
  _id: string;
  status: string;
  user_id?: string;
}

export interface AnalyzeSinistroResponse {
  status: "success" | "error";
  resultado?: string;
  message?: string;
}

export async function getAllSinistros(): Promise<Sinistro[]> {
  const { apiBaseUrl } = config;
  const requestRoute = "/admin/get/sinistros";

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
  return data.sinistros || data;
}

export async function getSinistrosByUser(userId: string): Promise<Sinistro[]> {
  const { apiBaseUrl } = config;
  const requestRoute = `/admin/get/sinistros/${userId}`;

  const options = {
    method: "GET",
    credentials: "include" as RequestCredentials,
  };

  const response = await fetch(apiBaseUrl + requestRoute, options);
  if (!response.ok) {
    throw new Error("Erro ao obter sinistros do usuário");
  }
  
  const data = await response.json();
  console.log(`Sinistros do usuário ${userId} obtidos com sucesso:`, data);
  return data.sinistros || data;
}

export async function analyzeSinistro(sinistroId: string): Promise<AnalyzeSinistroResponse> {
  const { apiBaseUrl } = config;
  const requestRoute = `/admin/sinistro/analyze/${sinistroId}`;

  const options = {
    method: "POST",
    credentials: "include" as RequestCredentials,
  };

  const response = await fetch(apiBaseUrl + requestRoute, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Erro ao analisar sinistro");
  }
  
  const responseData = await response.json();
  console.log(`Sinistro ${sinistroId} analisado com sucesso:`, responseData);
  return responseData;
}