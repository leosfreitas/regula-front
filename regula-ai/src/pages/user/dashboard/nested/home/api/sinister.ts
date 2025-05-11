import { config } from "@/config/config";

export interface Sinistro {
  _id: string;
  cnh: string;
  cpf: string;
  endereco: string;
  data_acidente: string;
  descricao: string;
  status: string;
  created_at: string;
}

export interface CreateSinistroDTO {
  cnh: string;
  endereco: string;
  data_acidente: string; // ISO format date string
  descricao: string;
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

  // O back-end agora não espera o campo cpf, então enviamos apenas os campos necessários
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