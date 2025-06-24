
-- Primeiro, remover as políticas problemáticas existentes
DROP POLICY IF EXISTS "Apenas usuários aprovados podem acessar dados" ON public.profiles;
DROP POLICY IF EXISTS "Admins podem gerenciar todos os perfis" ON public.profiles;

-- Criar função de segurança para verificar se o usuário é admin
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT user_type::text FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Criar função de segurança para verificar o status do usuário
CREATE OR REPLACE FUNCTION public.get_current_user_status()
RETURNS TEXT AS $$
  SELECT status::text FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Criar políticas RLS mais seguras usando as funções
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (id = auth.uid());

-- Política para que admins possam ver todos os perfis
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (public.get_current_user_role() = 'admin' AND public.get_current_user_status() = 'approved');

-- Política para que admins possam atualizar qualquer perfil
CREATE POLICY "Admins can update all profiles" 
  ON public.profiles 
  FOR UPDATE 
  USING (public.get_current_user_role() = 'admin' AND public.get_current_user_status() = 'approved');

-- Política para inserção de novos perfis (apenas pelo trigger)
CREATE POLICY "Allow profile creation" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (true);
