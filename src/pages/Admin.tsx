
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, LogOut, Users, Building } from 'lucide-react';
import CategoryManager from '@/components/admin/CategoryManager';
import ProductManager from '@/components/admin/ProductManager';
import PromotionManager from '@/components/admin/PromotionManager';
import UserManager from '@/components/admin/UserManager';
import CompanyInfoManager from '@/components/admin/CompanyInfoManager';

const Admin = () => {
  const { user, loading, isAdmin, signOut } = useAuth();
  const { toast } = useToast();

  // Redirect if not authenticated or not admin
  if (!loading && (!user || !isAdmin)) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-600">🍔 Admin - Burger House</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Olá, {user?.email}</span>
            <Button
              onClick={signOut}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Painel Administrativo</CardTitle>
            <CardDescription>
              Gerencie categorias, produtos, promoções, usuários e informações da empresa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="categories" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="categories">Categorias</TabsTrigger>
                <TabsTrigger value="products">Produtos</TabsTrigger>
                <TabsTrigger value="promotions">Promoções</TabsTrigger>
                <TabsTrigger value="users">Usuários</TabsTrigger>
                <TabsTrigger value="company">Empresa</TabsTrigger>
              </TabsList>
              
              <TabsContent value="categories" className="mt-6">
                <CategoryManager />
              </TabsContent>
              
              <TabsContent value="products" className="mt-6">
                <ProductManager />
              </TabsContent>
              
              <TabsContent value="promotions" className="mt-6">
                <PromotionManager />
              </TabsContent>

              <TabsContent value="users" className="mt-6">
                <UserManager />
              </TabsContent>

              <TabsContent value="company" className="mt-6">
                <CompanyInfoManager />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
