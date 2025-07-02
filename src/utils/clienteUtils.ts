
export const formatPhoneNumber = (phone: string): string => {
  // Remove todos os caracteres que não são dígitos
  return phone.replace(/\D/g, '');
};

export const getClienteFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const cliente = urlParams.get('cliente');
  
  // Se encontrou o parâmetro, formata removendo caracteres especiais
  if (cliente) {
    return formatPhoneNumber(cliente);
  }
  
  return null;
};

export const storeClienteInSession = (cliente: string): void => {
  sessionStorage.setItem('cliente', cliente);
};

export const getClienteFromSession = (): string | null => {
  return sessionStorage.getItem('cliente');
};

export const clearClienteFromSession = (): void => {
  sessionStorage.removeItem('cliente');
};
