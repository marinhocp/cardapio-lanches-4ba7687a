
import React from 'react';

interface BackToWhatsAppButtonProps {
  show: boolean;
}

const BackToWhatsAppButton: React.FC<BackToWhatsAppButtonProps> = ({ show }) => {
  if (!show) return null;

  const handleBackToWhatsApp = () => {
    const telefone = "5511999999999"; // Substitua pelo número do WhatsApp de atendimento
    const mensagem = "Olá! Meu pedido foi finalizado com sucesso.";
    window.location.href = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
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
