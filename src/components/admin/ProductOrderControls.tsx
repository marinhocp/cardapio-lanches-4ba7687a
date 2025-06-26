
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface ProductOrderControlsProps {
  productId: string;
  index: number;
  totalProducts: number;
  onMoveProduct: (productId: string, direction: 'up' | 'down') => void;
  disabled: boolean;
}

const ProductOrderControls = ({ 
  productId, 
  index, 
  totalProducts, 
  onMoveProduct, 
  disabled 
}: ProductOrderControlsProps) => {
  return (
    <div className="flex gap-1">
      <Button
        onClick={() => onMoveProduct(productId, 'up')}
        size="sm"
        variant="outline"
        disabled={index === 0 || disabled}
      >
        <ArrowUp size={14} />
      </Button>
      <Button
        onClick={() => onMoveProduct(productId, 'down')}
        size="sm"
        variant="outline"
        disabled={index === totalProducts - 1 || disabled}
      >
        <ArrowDown size={14} />
      </Button>
    </div>
  );
};

export default ProductOrderControls;
