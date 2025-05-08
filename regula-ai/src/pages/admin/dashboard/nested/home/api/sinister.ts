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
  user_id?: string; // Optional field, may be present in admin view
}

export interface UpdateSinistroDTO {
  status: "Aberto" | "Em análise" | "Negado" | "Aprovado" | "Pago";
}

/**
 * Get all sinistros for admin view
 * @returns {Promise<Sinistro[]>} Array of sinistros
 */
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

/**
 * Get sinistros by user ID
 * @param {string} userId - ID of the user
 * @returns {Promise<Sinistro[]>} Array of sinistros for the specified user
 */
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

/**
 * Update sinistro status
 * @param {string} sinistroId - ID of the sinistro to update
 * @param {UpdateSinistroDTO} updateData - Data for update (status)
 * @returns {Promise<Object>} Result with response and response data
 */
export async function updateSinistroStatus(
  sinistroId: string,
  updateData: UpdateSinistroDTO
): Promise<{ response: Response; responseData: any }> {
  const { apiBaseUrl } = config;
  const requestRoute = `/admin/update/sinistro/${sinistroId}`;

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
    credentials: "include" as RequestCredentials,
  };

  const response = await fetch(apiBaseUrl + requestRoute, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Erro ao atualizar status do sinistro");
  }
  
  const responseData = await response.json();
  console.log(`Status do sinistro ${sinistroId} atualizado com sucesso:`, responseData);
  return { response, responseData };
}