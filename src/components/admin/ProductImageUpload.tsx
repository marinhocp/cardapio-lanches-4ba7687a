
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProductImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({ value, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `product-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('fotos-lanches')
        .upload(fileName, file);

      if (error) throw error;

      // Obter URL pública do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from('fotos-lanches')
        .getPublicUrl(fileName);

      onChange(publicUrl);

      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso!",
      });
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: error.message || "Erro ao enviar imagem",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    onChange('');
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="image">URL da Imagem</Label>
      <div className="flex gap-2">
        <Input
          id="image"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://exemplo.com/imagem.jpg"
          className="flex-1"
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('image-file-input')?.click()}
            disabled={uploading}
            className="flex items-center gap-2"
          >
            <Upload size={16} />
            {uploading ? 'Enviando...' : 'Upload'}
          </Button>
          {value && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearImage}
              className="px-2"
            >
              <X size={16} />
            </Button>
          )}
        </div>
      </div>
      
      <input
        id="image-file-input"
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      {value && (
        <div className="mt-2">
          <img
            src={value}
            alt="Preview"
            className="w-32 h-32 object-cover rounded border"
            onError={(e) => {
              console.error('Erro ao carregar imagem:', e);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;
