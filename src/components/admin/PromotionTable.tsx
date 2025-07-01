
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PromotionTableRow from './PromotionTableRow';

interface Promotion {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  active: boolean;
  valid_until: string | null;
  created_at: string;
}

interface PromotionTableProps {
  promotions: Promotion[];
  onEdit: (promotion: Promotion) => void;
  onDelete: (id: string) => void;
  disabled: boolean;
}

const PromotionTable: React.FC<PromotionTableProps> = ({
  promotions,
  onEdit,
  onDelete,
  disabled
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Promoções Cadastradas</CardTitle>
      </CardHeader>
      <CardContent>
        {promotions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Nenhuma promoção cadastrada.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Válida até</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((promotion) => (
                <PromotionTableRow
                  key={promotion.id}
                  promotion={promotion}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  disabled={disabled}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default PromotionTable;
