
import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import ExtraSelector from './ExtraSelector';

interface Extra {
  id: string;
  name: string;
  price: number;
}

interface CartItemData {
  id: string;
  name: string;
  price: number;
  image: string;
  observations?: string;
  extras?: string[];
}

interface CartItemProps {
  item: CartItemData;
  allExtras: Extra[];
  onUpdate: (id: string, updates: Partial<CartItemData>) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, allExtras, onUpdate, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editObservations, setEditObservations] = useState('');
  const [editExtras, setEditExtras] = useState<string[]>([]);

  const startEdit = () => {
    setIsEditing(true);
    setEditObservations(item.observations || '');
    setEditExtras(item.extras || []);
  };

  const saveEdit = () => {
    onUpdate(item.id, {
      observations: editObservations,
      extras: editExtras
    });
    setIsEditing(false);
    setEditObservations('');
    setEditExtras([]);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditObservations('');
    setEditExtras([]);
  };

  const getExtraNames = (extraIds: string[]) => {
    return extraIds.map(id => {
      const extra = allExtras.find(e => e.id === id);
      return extra ? extra.name : '';
    }).filter(Boolean);
  };

  const getExtrasPrice = (extraIds: string[]) => {
    return extraIds.reduce((total, id) => {
      const extra = allExtras.find(e => e.id === id);
      return total + (extra ? extra.price : 0);
    }, 0);
  };

  const getItemTotalPrice = () => {
    const basePrice = item.price;
    const extrasPrice = getExtrasPrice(item.extras || []);
    return basePrice + extrasPrice;
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      {isEditing ? (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">{item.name}</h3>
          
          <ExtraSelector
            selectedExtras={editExtras}
            onExtrasChange={setEditExtras}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={editObservations}
              onChange={(e) => setEditObservations(e.target.value)}
              placeholder="Observações..."
              className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
              rows={2}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={saveEdit}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
            >
              Salvar
            </button>
            <button
              onClick={cancelEdit}
              className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">{item.name}</h3>
            
            {item.extras && item.extras.length > 0 && (
              <p className="text-sm text-blue-600 mt-1">
                Extras: {getExtraNames(item.extras).join(', ')} (+R$ {getExtrasPrice(item.extras).toFixed(2).replace('.', ',')})
              </p>
            )}
            
            {item.observations && (
              <p className="text-sm text-gray-600 mt-1">Obs: {item.observations}</p>
            )}
            
            <p className="text-red-600 font-bold">R$ {getItemTotalPrice().toFixed(2).replace('.', ',')}</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={startEdit}
              className="text-blue-500 hover:text-blue-700 p-2"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => onRemove(item.id)}
              className="text-red-500 hover:text-red-700 p-2"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItem;
