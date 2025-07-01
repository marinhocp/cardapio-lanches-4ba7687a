
import React from 'react';
import CartItem from './CartItem';

interface Extra {
  id: string;
  name: string;
  price: number;
}

interface CartItemData {
  id: string;
  name: string;
  price: number;
  image: string;
  observations?: string;
  extras?: string[];
}

interface CartContentProps {
  items: CartItemData[];
  allExtras: Extra[];
  onUpdateItem: (id: string, updates: Partial<CartItemData>) => void;
  onRemoveItem: (id: string) => void;
}

const CartContent: React.FC<CartContentProps> = ({
  items,
  allExtras,
  onUpdateItem,
  onRemoveItem
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      {items.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Seu carrinho está vazio</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              allExtras={allExtras}
              onUpdate={onUpdateItem}
              onRemove={onRemoveItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CartContent;
