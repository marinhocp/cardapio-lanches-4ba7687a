
export const getClienteFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('cliente');
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
