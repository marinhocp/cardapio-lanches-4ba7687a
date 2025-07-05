
import React from 'react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';

interface Promotion {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  active: boolean;
  valid_until: string | null;
  created_at: string;
}

interface PromotionTableRowProps {
  promotion: Promotion;
  onEdit: (promotion: Promotion) => void;
  onDelete: (id: string) => void;
  disabled: boolean;
}

const PromotionTableRow: React.FC<PromotionTableRowProps> = ({
  promotion,
  onEdit,
  onDelete,
  disabled
}) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{promotion.name}</TableCell>
      <TableCell>R$ {promotion.price.toFixed(2).replace('.', ',')}</TableCell>
      <TableCell>
        {promotion.valid_until 
          ? new Date(promotion.valid_until).toLocaleDateString('pt-BR')
          : 'Sem data limite'
        }
      </TableCell>
      <TableCell>
        <span className={`px-2 py-1 text-xs rounded-full ${
          promotion.active 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {promotion.active ? 'Ativa' : 'Inativa'}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            onClick={() => onEdit(promotion)}
            size="sm"
            variant="outline"
            disabled={disabled}
          >
            <Edit size={14} />
          </Button>
          <Button
            onClick={() => onDelete(promotion.id)}
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

export default PromotionTableRow;
