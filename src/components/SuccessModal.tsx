
import React from 'react';
import { X } from 'lucide-react';
import BackToWhatsAppButton from './BackToWhatsAppButton';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Pedido Finalizado</h2>
          <button
            onClick={onClose}
            className="bg-gray-100 rounded-full p-2 hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        <BackToWhatsAppButton show={true} />
      </div>
    </div>
  );
};

export default SuccessModal;
