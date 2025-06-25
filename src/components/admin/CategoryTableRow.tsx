
import React from 'react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import CategoryOrderControls from './CategoryOrderControls';

interface Category {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
  created_at: string;
}

interface CategoryTableRowProps {
  category: Category;
  index: number;
  totalCategories: number;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onMoveCategory: (categoryId: string, direction: 'up' | 'down') => void;
  disabled: boolean;
}

const CategoryTableRow = ({ 
  category, 
  index, 
  totalCategories, 
  onEdit, 
  onDelete, 
  onMoveCategory, 
  disabled 
}: CategoryTableRowProps) => {
  return (
    <TableRow>
      <TableCell>
        <CategoryOrderControls
          categoryId={category.id}
          index={index}
          totalCategories={totalCategories}
          onMoveCategory={onMoveCategory}
          disabled={disabled}
        />
      </TableCell>
      <TableCell className="font-medium">{category.name}</TableCell>
      <TableCell>{category.description || '-'}</TableCell>
      <TableCell>
        {new Date(category.created_at).toLocaleDateString('pt-BR')}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            onClick={() => onEdit(category)}
            size="sm"
            variant="outline"
            disabled={disabled}
          >
            <Edit size={14} />
          </Button>
          <Button
            onClick={() => onDelete(category.id)}
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700"
            disabled={disabled}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default CategoryTableRow;
