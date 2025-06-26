
-- Adicionar campo webhook na tabela company_info
ALTER TABLE company_info 
ADD COLUMN webhook_url TEXT DEFAULT 'https://n8n2.engsoft.app.br/webhook/AutoZap';

-- Adicionar campo display_order na tabela products
ALTER TABLE products 
ADD COLUMN display_order INTEGER DEFAULT 0;

-- Criar tabela para extras (antigos adicionais)
CREATE TABLE public.extras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
