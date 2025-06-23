
-- Criar tabela para informações da empresa
CREATE TABLE public.company_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  logo_url TEXT,
  banner_url TEXT,
  opening_hours JSONB,
  social_media JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir dados iniciais da empresa
INSERT INTO public.company_info (name, description, phone, email, address, opening_hours) 
VALUES (
  'Burger House',
  'O melhor hambúrguer da cidade!',
  '(11) 99999-9999',
  'contato@burgerhouse.com',
  'Rua das Delícias, 123 - Centro',
  '{"segunda": "18:00-23:00", "terca": "18:00-23:00", "quarta": "18:00-23:00", "quinta": "18:00-23:00", "sexta": "18:00-00:00", "sabado": "18:00-00:00", "domingo": "18:00-23:00"}'::jsonb
);

-- Adicionar RLS à tabela company_info
ALTER TABLE public.company_info ENABLE ROW LEVEL SECURITY;

-- Política para que apenas admins possam gerenciar informações da empresa
CREATE POLICY "Apenas admins podem gerenciar informações da empresa" 
  ON public.company_info 
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND user_type = 'admin' 
      AND status = 'approved'
    )
  );

-- Política para visualização pública das informações da empresa
CREATE POLICY "Informações da empresa são públicas para leitura" 
  ON public.company_info 
  FOR SELECT 
  USING (true);
