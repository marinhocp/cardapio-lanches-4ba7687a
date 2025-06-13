
import React from 'react';
import ProductCard from './ProductCard';

const menuCategories = [
  {
    title: "Lanches Tradicionais",
    id: "lanches-tradicionais",
    items: [
      {
        id: "1",
        name: "X-BURGUER",
        description: "Pão, hambúrguer artesanal, queijo, alface, tomate e molho especial",
        price: 18.90,
        image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop"
      },
      {
        id: "2",
        name: "X-SALADA",
        description: "Pão, hambúrguer artesanal, queijo, alface, tomate, cebola e molho especial",
        price: 20.90,
        image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop"
      },
      {
        id: "3",
        name: "X-TUDO",
        description: "Pão, hambúrguer artesanal, queijo, presunto, ovo, batata palha, alface, tomate, milho e molho especial",
        price: 24.90,
        image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop"
      }
    ]
  },
  {
    title: "Smash e Gourmet",
    id: "smash-gourmet",
    items: [
      {
        id: "4",
        name: "SMASH DUPLO",
        description: "Pão brioche, dois hambúrgueres smash, queijo cheddar, cebola caramelizada e molho especial",
        price: 28.90,
        image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop"
      },
      {
        id: "5",
        name: "GOURMET BACON",
        description: "Pão artesanal, hambúrguer 180g, queijo brie, bacon crocante, rúcula e geleia de pimenta",
        price: 32.90,
        image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop"
      }
    ]
  },
  {
    title: "Frango e Especiais",
    id: "frango-especiais",
    items: [
      {
        id: "6",
        name: "CHICKEN CRISPY",
        description: "Pão, frango empanado crocante, queijo, alface, tomate e maionese temperada",
        price: 22.90,
        image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop"
      },
      {
        id: "7",
        name: "VEGGIE BURGER",
        description: "Pão integral, hambúrguer de grão-de-bico, queijo vegano, alface, tomate e molho tahine",
        price: 26.90,
        image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop"
      }
    ]
  },
  {
    title: "Bebidas",
    id: "bebidas",
    items: [
      {
        id: "8",
        name: "Coca-Cola 2L",
        description: "Refrigerante Coca-Cola 2 litros gelado",
        price: 8.90,
        image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop"
      },
      {
        id: "9",
        name: "Suco Natural 500ml",
        description: "Suco natural de laranja, limão ou maracujá - 500ml",
        price: 6.90,
        image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop"
      },
      {
        id: "10",
        name: "Água Mineral 500ml",
        description: "Água mineral sem gás 500ml gelada",
        price: 3.90,
        image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop"
      }
    ]
  }
];

interface MenuSectionProps {
  onProductClick: (product: any) => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({ onProductClick }) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {menuCategories.map((category, index) => (
          <div key={index} id={category.id} className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              {category.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.items.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  onClick={() => onProductClick(item)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MenuSection;
