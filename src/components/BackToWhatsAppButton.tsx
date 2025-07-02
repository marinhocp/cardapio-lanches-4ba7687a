
import React from 'react';

interface BackToWhatsAppButtonProps {
  show: boolean;
}

const BackToWhatsAppButton: React.FC<BackToWhatsAppButtonProps> = ({ show }) => {
  if (!show) return null;

  const handleBackToWhatsApp = () => {
    const cliente = sessionStorage.getItem('cliente');
    if (cliente) {
      const mensagem = "Olá! Meu pedido foi finalizado com sucesso.";
      window.location.href = `https://wa.me/${cliente}?text=${encodeURIComponent(mensagem)}`;
    } else {
      console.error('Parâmetro cliente não encontrado');
      alert('Erro: Não foi possível obter o número do cliente');
    }
  };

  return (
    <div className="text-center mt-4">
      <h2 className="text-xl font-bold text-green-600 mb-4">Pedido enviado com sucesso!</h2>
      <button
        onClick={handleBackToWhatsApp}
        className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
      >
        Voltar ao WhatsApp
      </button>
    </div>
  );
};

export default BackToWhatsAppButton;
