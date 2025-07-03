-- Permitir uploads de imagem no bucket fotos-lanches
-- Tornar o bucket público para visualização das imagens
UPDATE storage.buckets 
SET public = true 
WHERE name = 'fotos-lanches';

-- Criar políticas para permitir upload de imagens por admins
CREATE POLICY "Admins podem fazer upload de imagens de produtos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'fotos-lanches' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type = 'admin' 
    AND status = 'approved'
  )
);

CREATE POLICY "Qualquer um pode ver imagens de produtos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'fotos-lanches');

CREATE POLICY "Admins podem atualizar imagens de produtos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'fotos-lanches' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type = 'admin' 
    AND status = 'approved'
  )
);

CREATE POLICY "Admins podem deletar imagens de produtos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'fotos-lanches' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type = 'admin' 
    AND status = 'approved'
  )
);