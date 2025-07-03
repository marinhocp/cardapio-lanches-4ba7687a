
import React from 'react';
import CartManager from './cart/CartManager';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  return <CartManager isOpen={isOpen} onClose={onClose} />;
};

export default Cart;
