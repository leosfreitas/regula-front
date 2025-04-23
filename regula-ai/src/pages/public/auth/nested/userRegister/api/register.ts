import { config } from "@/config/config";

export async function registerRequest(formData: {
  name: string;
  email: string;
  password: string;
  phone: string;
  cpf: string;
}): Promise<Response> {
  const { apiBaseUrl } = config;
  const requestRoute = '/user/auth/register';

  const bodyData = {
    name: formData.name,
    email: formData.email,
    password: formData.password,
    phone: formData.phone,
    cpf: formData.cpf,
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyData),
  };

  const response = await fetch(apiBaseUrl + requestRoute, options);

  if (!response.ok) {
    throw new Error('Erro ao realizar o cadastro');
  }

  return response;
}