import { config } from "@/config/config";

export interface ContactDTO {
  _id: string;
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  mensagem: string;
  status: "S" | "N";
}

export interface UpdateContactDTO {
  status: "S" | "N";
}

export async function deleteContact(contactId: string): Promise<void> {
  const { apiBaseUrl } = config;
  const requestRoute = `/admin/contact/delete/${contactId}`;
  
  const options = {
    method: "DELETE",
    credentials: "include" as RequestCredentials,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(apiBaseUrl + requestRoute, options);
    
    if (!response.ok) {
      throw new Error("Erro ao excluir contato: " + response.statusText);
    }
    
    console.log("Contato excluído com sucesso");
  } catch (error) {
    console.error("Erro na requisição de exclusão:", error);
    throw error;
  }
}

export async function getAllContacts(): Promise<ContactDTO[]> {
  const { apiBaseUrl } = config;
  const requestRoute = "/admin/get/contacts";
  
  const options = {
    method: "GET",
    credentials: "include" as RequestCredentials,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(apiBaseUrl + requestRoute, options);
    
    if (!response.ok) {
      throw new Error("Erro ao buscar contatos: " + response.statusText);
    }
    
    const data = await response.json();
    return data.contacts;
  } catch (error) {
    console.error("Erro na requisição de listagem de contatos:", error);
    throw error;
  }
}

// Função para atualizar o status de um contato
export async function updateContactStatus(contactId: string, data: UpdateContactDTO): Promise<void> {
  const { apiBaseUrl } = config;
  const requestRoute = `/admin/update/contact/${contactId}`;
  
  const options = {
    method: "PUT",
    credentials: "include" as RequestCredentials,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(apiBaseUrl + requestRoute, options);
    
    if (!response.ok) {
      throw new Error("Erro ao atualizar contato: " + response.statusText);
    }
    
    console.log("Status do contato atualizado com sucesso");
  } catch (error) {
    console.error("Erro na requisição de atualização:", error);
    throw error;
  }
}