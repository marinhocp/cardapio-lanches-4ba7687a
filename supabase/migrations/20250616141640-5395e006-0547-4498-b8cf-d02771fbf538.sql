
-- Criar tabela de categorias
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de produtos
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image TEXT,
  category_id UUID REFERENCES public.categories(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de promoções
CREATE TABLE public.promotions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image TEXT,
  active BOOLEAN DEFAULT true,
  valid_until DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para categorias (público pode ver, apenas admins podem modificar)
CREATE POLICY "Qualquer um pode ver categorias" 
  ON public.categories 
  FOR SELECT 
  USING (true);

CREATE POLICY "Apenas admins podem inserir categorias" 
  ON public.categories 
  FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Apenas admins podem atualizar categorias" 
  ON public.categories 
  FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Apenas admins podem deletar categorias" 
  ON public.categories 
  FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Políticas para produtos (público pode ver, apenas admins podem modificar)
CREATE POLICY "Qualquer um pode ver produtos" 
  ON public.products 
  FOR SELECT 
  USING (true);

CREATE POLICY "Apenas admins podem inserir produtos" 
  ON public.products 
  FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Apenas admins podem atualizar produtos" 
  ON public.products 
  FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Apenas admins podem deletar produtos" 
  ON public.products 
  FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Políticas para promoções (público pode ver, apenas admins podem modificar)
CREATE POLICY "Qualquer um pode ver promoções" 
  ON public.promotions 
  FOR SELECT 
  USING (true);

CREATE POLICY "Apenas admins podem inserir promoções" 
  ON public.promotions 
  FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Apenas admins podem atualizar promoções" 
  ON public.promotions 
  FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Apenas admins podem deletar promoções" 
  ON public.promotions 
  FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Políticas para perfis
CREATE POLICY "Usuários podem ver seus próprios perfis" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios perfis" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Inserir algumas categorias iniciais
INSERT INTO public.categories (name, description) VALUES
  ('Lanches Tradicionais', 'Hamburgers clássicos e tradicionais'),
  ('Smash e Gourmet', 'Hamburgers gourmet e smash burgers'),
  ('Frango e Especiais', 'Sanduíches de frango e opções especiais'),
  ('Bebidas', 'Refrigerantes, sucos e bebidas');

-- Inserir alguns produtos iniciais
INSERT INTO public.products (name, description, price, category_id, image) 
SELECT 
  'X-Burguer', 
  'Hambúrguer, queijo, alface, tomate e maionese', 
  15.90,
  c.id,
  '/placeholder.svg'
FROM public.categories c WHERE c.name = 'Lanches Tradicionais';

INSERT INTO public.products (name, description, price, category_id, image) 
SELECT 
  'X-Bacon', 
  'Hambúrguer, bacon, queijo, alface, tomate e maionese', 
  18.90,
  c.id,
  '/placeholder.svg'
FROM public.categories c WHERE c.name = 'Lanches Tradicionais';
