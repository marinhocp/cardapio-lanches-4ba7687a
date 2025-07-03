import { getBotFromSession, getClienteFromSession, getInstanciaFromSession } from './clienteUtils';

interface Extra {
  id: string;
  name: string;
  price: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  observations?: string;
  extras?: string[];
}

export const getExtrasPrice = (extraIds: string[], allExtras: Extra[]) => {
  return extraIds.reduce((total, id) => {
    const extra = allExtras.find(e => e.id === id);
    return total + (extra ? extra.price : 0);
  }, 0);
};

export const getItemTotalPrice = (item: CartItem, allExtras: Extra[]) => {
  const basePrice = item.price;
  const extrasPrice = getExtrasPrice(item.extras || [], allExtras);
  return basePrice + extrasPrice;
};

export const getTotalWithExtras = (items: CartItem[], allExtras: Extra[]) => {
  return items.reduce((total, item) => total + getItemTotalPrice(item, allExtras), 0);
};

export const getExtraNames = (extraIds: string[], allExtras: Extra[]) => {
  return extraIds.map(id => {
    const extra = allExtras.find(e => e.id === id);
    return extra ? extra.name : '';
  }).filter(Boolean);
};

export const createOrderData = (
  items: CartItem[],
  allExtras: Extra[],
  paymentMethod: string,
  deliveryMethod: string,
  address: string,
  email: string,
  changeAmount: string
) => {
  const bot = getBotFromSession();
  const cliente = getClienteFromSession();
  const instancia = getInstanciaFromSession();

  return {
    itemsMessage: items.map(item => ({
      [item.name]: {
        preço: {
          valor: getItemTotalPrice(item, allExtras),
          extras: item.extras ? getExtraNames(item.extras, allExtras) : [],
          observação: item.observations ?? ''
        }
      }
    })),
    paymentMethod: {
      totalAmount: getTotalWithExtras(items, allExtras),
      troco: paymentMethod === 'Dinheiro' && changeAmount ? parseFloat(changeAmount) : null,
      email: paymentMethod === 'Pix' ? email : null
    },
    deliveryMethod: {
      address: deliveryMethod === 'delivery' ? address : null
    },
    bot: bot ?? null,
    cliente: cliente ?? null,
    instancia: instancia ?? null,
    timestamp: new Date().toISOString()
  };
};

export const formatOrderMessage = (
  items: CartItem[],
  allExtras: Extra[],
  paymentMethod: string,
  deliveryMethod: string,
  address: string,
  email: string,
  changeAmount: string,
  bot: string | null
) => {
  const orderItems = items.map(item => {
    let itemText = `• ${item.name}`;
    
    if (item.extras && item.extras.length > 0) {
      const extraNames = getExtraNames(item.extras, allExtras);
      if (extraNames.length > 0) {
        itemText += ` (+ ${extraNames.join(', ')})`;
      }
    }
    
    if (item.observations) {
      itemText += ` - Obs: ${item.observations}`;
    }
    
    const itemTotal = getItemTotalPrice(item, allExtras);
    itemText += ` - R$ ${itemTotal.toFixed(2).replace('.', ',')}`;
    
    return itemText;
  });

  let orderMessage = `🍔 NOVO PEDIDO

${orderItems.join('\n')}

📍 Entrega: ${deliveryMethod === 'delivery' ? 'Entregar' : 'Retirar na loja'}`;

  if (deliveryMethod === 'delivery') {
    orderMessage += `\n📌 Endereço: ${address}`;
  }

  orderMessage += `\n💳 Pagamento: ${paymentMethod}`;

  if (paymentMethod === 'Pix') {
    orderMessage += `\n📧 Email: ${email}`;
  }

  if (paymentMethod === 'Dinheiro' && changeAmount) {
    orderMessage += `\n💰 Troco para: R$ ${parseFloat(changeAmount).toFixed(2).replace('.', ',')}`;
  }

  if (bot) {
    orderMessage += `\n👤 Bot: ${bot}`;
  }

  orderMessage += `\n\n💰 Total: R$ ${getTotalWithExtras(items, allExtras).toFixed(2).replace('.', ',')}`;

  return orderMessage;
};