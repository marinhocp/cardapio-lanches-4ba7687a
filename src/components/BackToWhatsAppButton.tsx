
import React from 'react';

interface BackToWhatsAppButtonProps {
  show: boolean;
}

const BackToWhatsAppButton: React.FC<BackToWhatsAppButtonProps> = ({ show }) => {
  if (!show) return null;

  const handleBackToWhatsApp = () => {
    const bot = sessionStorage.getItem('bot');
    console.log('Tentando obter bot do sessionStorage:', bot);
    console.log('Todos os itens do sessionStorage:', sessionStorage);
    if (bot) {
      const mensagem = "Olá! Meu pedido foi finalizado com sucesso.";
      console.log('Redirecionando para WhatsApp:', `https://wa.me/${bot}`);
      window.location.href = `https://wa.me/${bot}?text=${encodeURIComponent(mensagem)}`;
    } else {
      console.error('Parâmetro bot não encontrado no sessionStorage');
      alert('Erro: Não foi possível obter o número do bot');
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
