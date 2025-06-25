
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface CategoryOrderControlsProps {
  categoryId: string;
  index: number;
  totalCategories: number;
  onMoveCategory: (categoryId: string, direction: 'up' | 'down') => void;
  disabled: boolean;
}

const CategoryOrderControls = ({ 
  categoryId, 
  index, 
  totalCategories, 
  onMoveCategory, 
  disabled 
}: CategoryOrderControlsProps) => {
  return (
    <div className="flex gap-1">
      <Button
        onClick={() => onMoveCategory(categoryId, 'up')}
        size="sm"
        variant="outline"
        disabled={index === 0 || disabled}
      >
        <ArrowUp size={14} />
      </Button>
      <Button
        onClick={() => onMoveCategory(categoryId, 'down')}
        size="sm"
        variant="outline"
        disabled={index === totalCategories - 1 || disabled}
      >
        <ArrowDown size={14} />
      </Button>
    </div>
  );
};

export default CategoryOrderControls;
