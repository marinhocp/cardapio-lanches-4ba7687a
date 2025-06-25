
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CategoryTableRow from './CategoryTableRow';

interface Category {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
  created_at: string;
}

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onMoveCategory: (categoryId: string, direction: 'up' | 'down') => void;
  disabled: boolean;
}

const CategoryTable = ({ categories, onEdit, onDelete, onMoveCategory, disabled }: CategoryTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorias Cadastradas</CardTitle>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Nenhuma categoria cadastrada.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ordem</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category, index) => (
                <CategoryTableRow
                  key={category.id}
                  category={category}
                  index={index}
                  totalCategories={categories.length}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onMoveCategory={onMoveCategory}
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

export default CategoryTable;
