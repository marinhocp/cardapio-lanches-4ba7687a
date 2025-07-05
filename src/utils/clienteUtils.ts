
export const formatPhoneNumber = (phone: string): string => {
  // Remove todos os caracteres que não são dígitos
  return phone.replace(/\D/g, '');
};

// Session Token functions
export const getSessionTokenFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('st');
};

export const storeSessionTokenInLocalStorage = (sessionToken: string): void => {
  localStorage.setItem('session_token', sessionToken);
};

export const getSessionTokenFromLocalStorage = (): string | null => {
  return localStorage.getItem('session_token');
};

export const clearSessionTokenFromLocalStorage = (): void => {
  localStorage.removeItem('session_token');
};

// Original functions
export const getBotFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const bot = urlParams.get('bot');
  
  // Se encontrou o parâmetro, formata removendo caracteres especiais
  if (bot) {
    return formatPhoneNumber(bot);
  }
  
  return null;
};

export const getClienteFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('cliente');
};

export const getInstanciaFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('instancia');
};

export const storeBotInSession = (bot: string): void => {
  sessionStorage.setItem('bot', bot);
};

export const storeClienteInSession = (cliente: string): void => {
  sessionStorage.setItem('cliente', cliente);
};

export const storeInstanciaInSession = (instancia: string): void => {
  sessionStorage.setItem('instancia', instancia);
};

export const getBotFromSession = (): string | null => {
  return sessionStorage.getItem('bot');
};

export const getClienteFromSession = (): string | null => {
  return sessionStorage.getItem('cliente');
};

export const getInstanciaFromSession = (): string | null => {
  return sessionStorage.getItem('instancia');
};

export const clearBotFromSession = (): void => {
  sessionStorage.removeItem('bot');
};

export const clearClienteFromSession = (): void => {
  sessionStorage.removeItem('cliente');
};

export const clearInstanciaFromSession = (): void => {
  sessionStorage.removeItem('instancia');
};

export const clearAllParametersFromSession = (): void => {
  clearBotFromSession();
  clearClienteFromSession();
  clearInstanciaFromSession();
};
