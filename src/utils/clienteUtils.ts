
export const formatPhoneNumber = (phone: string): string => {
  // Remove todos os caracteres que não são dígitos
  return phone.replace(/\D/g, '');
};

export const getBotFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const bot = urlParams.get('bot');
  
  // Se encontrou o parâmetro, formata removendo caracteres especiais
  if (bot) {
    return formatPhoneNumber(bot);
  }
  
  return null;
};

export const storeBotInSession = (bot: string): void => {
  sessionStorage.setItem('bot', bot);
};

export const getBotFromSession = (): string | null => {
  return sessionStorage.getItem('bot');
};

export const clearBotFromSession = (): void => {
  sessionStorage.removeItem('bot');
};
