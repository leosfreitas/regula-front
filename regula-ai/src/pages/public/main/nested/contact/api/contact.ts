import { config } from "@/config/config";

export async function createContact(contactData: {
  nome?: string;
  email: string;
  telefone?: string;
  empresa?: string;
  mensagem: string;
}): Promise<void> {
  const { apiBaseUrl } = config;
  const requestRoute = "/contact/create";
  
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contactData),
  };

  try {
    const response = await fetch(apiBaseUrl + requestRoute, options);

    if (!response.ok) {
      throw new Error("Erro ao enviar contato: " + response.statusText);
    }

    console.log("Contato enviado com sucesso");
  } catch (error) {
    console.error("Erro na requisição de contato:", error);
    throw error;
  }
}
