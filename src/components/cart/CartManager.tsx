import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useCompanyData } from '../../hooks/useCompanyData';
import { useOrderSubmission } from '../../hooks/useOrderSubmission';
import { getTotalWithExtras } from '../../utils/orderUtils';
import CartHeader from '../CartHeader';
import CartContent from '../CartContent';
import CartFooter from '../CartFooter';
import SuccessModal from '../SuccessModal';

interface CartManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartManager: React.FC<CartManagerProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, updateItem } = useCart();
  const { companyInfo, allExtras } = useCompanyData();
  const { submitOrder, isSubmitting } = useOrderSubmission(companyInfo, allExtras);
  
  const [paymentMethod, setPaymentMethod] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [changeAmount, setChangeAmount] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSubmitOrder = async () => {
    const success = await submitOrder(
      paymentMethod,
      deliveryMethod,
      address,
      email,
      changeAmount
    );

    if (success) {
      // Limpar dados do formulário (mas manter parâmetros no sessionStorage)
      setPaymentMethod('');
      setDeliveryMethod('');
      setAddress('');
      setEmail('');
      setChangeAmount('');
      setShowSuccessMessage(true);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessMessage(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <CartHeader onClose={onClose} />
          
          <CartContent
            items={items}
            allExtras={allExtras}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
          />

          {items.length > 0 && (
          <CartFooter
            total={getTotalWithExtras(items, allExtras)}
            paymentMethod={paymentMethod}
            deliveryMethod={deliveryMethod}
            address={address}
            email={email}
            changeAmount={changeAmount}
            isSubmitting={isSubmitting}
            onPaymentMethodChange={setPaymentMethod}
            onDeliveryMethodChange={setDeliveryMethod}
            onAddressChange={setAddress}
            onEmailChange={setEmail}
            onChangeAmountChange={setChangeAmount}
            onSubmitOrder={handleSubmitOrder}
          />
          )}
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessMessage}
        onClose={handleCloseSuccess}
      />
    </>
  );
};

export default CartManager;