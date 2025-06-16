
-- Adicionar enum para status do usuário
CREATE TYPE public.user_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');

-- Adicionar enum para tipo de usuário  
CREATE TYPE public.user_type AS ENUM ('admin', 'user');

-- Adicionar colunas na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN status user_status DEFAULT 'pending',
ADD COLUMN user_type user_type DEFAULT 'user';

-- Atualizar usuários existentes para serem aprovados e admin (para não quebrar o sistema atual)
UPDATE public.profiles SET status = 'approved', user_type = 'admin' WHERE role = 'admin';
UPDATE public.profiles SET status = 'approved', user_type = 'user' WHERE role = 'user' OR role IS NULL;

-- Atualizar a função handle_new_user para definir novos usuários como pendentes
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, status, user_type)
  VALUES (NEW.id, NEW.email, 'user', 'pending', 'user');
  RETURN NEW;
END;
$$;

-- Criar política para que apenas usuários aprovados possam acessar o sistema
CREATE POLICY "Apenas usuários aprovados podem acessar dados" 
  ON public.profiles 
  FOR SELECT 
  USING (status = 'approved' OR id = auth.uid());

-- Política para admins gerenciarem status de usuários
CREATE POLICY "Admins podem gerenciar todos os perfis" 
  ON public.profiles 
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND user_type = 'admin' 
      AND status = 'approved'
    )
  );
