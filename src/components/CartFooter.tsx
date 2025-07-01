
import React from 'react';
import OrderForm from './OrderForm';
import OrderSummary from './OrderSummary';

interface CartFooterProps {
  total: number;
  paymentMethod: string;
  deliveryMethod: string;
  address: string;
  email: string;
  changeAmount: string;
  isSubmitting: boolean;
  onPaymentMethodChange: (method: string) => void;
  onDeliveryMethodChange: (method: string) => void;
  onAddressChange: (address: string) => void;
  onEmailChange: (email: string) => void;
  onChangeAmountChange: (amount: string) => void;
  onSubmitOrder: () => void;
}

const CartFooter: React.FC<CartFooterProps> = ({
  total,
  paymentMethod,
  deliveryMethod,
  address,
  email,
  changeAmount,
  isSubmitting,
  onPaymentMethodChange,
  onDeliveryMethodChange,
  onAddressChange,
  onEmailChange,
  onChangeAmountChange,
  onSubmitOrder
}) => {
  return (
    <div className="border-t p-6 space-y-4">
      <OrderSummary
        total={total}
        paymentMethod={paymentMethod}
        deliveryMethod={deliveryMethod}
        isSubmitting={isSubmitting}
        onSubmit={onSubmitOrder}
      />

      <OrderForm
        paymentMethod={paymentMethod}
        deliveryMethod={deliveryMethod}
        address={address}
        email={email}
        changeAmount={changeAmount}
        onPaymentMethodChange={onPaymentMethodChange}
        onDeliveryMethodChange={onDeliveryMethodChange}
        onAddressChange={onAddressChange}
        onEmailChange={onEmailChange}
        onChangeAmountChange={onChangeAmountChange}
      />
    </div>
  );
};

export default CartFooter;
