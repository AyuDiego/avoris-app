export interface CardData {
  imageUrl: string;
  tagText?: string;
  location: string;
  duration: string;
  title: string;
  priceLabel: string;
  price: string;
  detailsLabel: string;
  reserveLabel: string;
  priceDetails?: { 
    beforeTax: string;
    tax: string;
    other: string;  
    final: string;
  };
}
export interface CardGroup {
  groupTitle: string;
  cards: CardData[];
}

export const CARD_GROUPS: CardGroup[] = [
  {
    groupTitle: 'Asia',
    cards: [
      {
        imageUrl: 'assets/images/bangkok.webp',
        tagText: 'Quads',
        location: 'Marruecos, África',
        duration: '9 días',
        title: 'Descubre Bangkok con Iberojet',
        priceLabel: 'Desde',
        price: '248,00 €',
        priceDetails: {  
            beforeTax: '1.124,00 €',
            tax: '4,43 €',
            other: '150,42 €',
            final: '2.455,00 €'  
          },
        detailsLabel: 'Ver desglose',
        reserveLabel: 'Reservar',
      },
      {
        imageUrl: 'assets/images/desert.webp',
        tagText: 'Quads',
        location: 'Tailandia, Asia',
        duration: '14 días',
        title: 'Aventura en las Islas Phi Phi',
        priceLabel: 'Desde',
        price: '1.150,00 €',
        detailsLabel: 'Ver desglose',
        reserveLabel: 'Reservar',
      },
      {
        imageUrl: 'assets/images/town.webp',
        tagText: 'Quads',
        location: 'Tailandia, Asia',
        duration: '14 días',
        title: 'Aventura en las Islas Phi Phi',
        priceLabel: 'Desde',
        price: '1.150,00 €',
        detailsLabel: 'Ver desglose',
        reserveLabel: 'Reservar',
      },
    ],
  },
  {
    groupTitle: 'África',
    cards: [
      {
        imageUrl: 'assets/images/bangkok.webp',
        tagText: 'Quads',
        location: 'Marruecos, África',
        duration: '9 días',
        title: 'Descubre Bangkok con Iberojet',
        priceLabel: 'Desde',
        price: '248,00 €',
        detailsLabel: 'Ver desglose',
        reserveLabel: 'Reservar',
      },
      {
        imageUrl: 'assets/images/desert.webp',
        tagText: 'Quads',
        location: 'Tailandia, Asia',
        duration: '14 días',
        title: 'Aventura en las Islas Phi Phi',
        priceLabel: 'Desde',
        price: '1.150,00 €',
        detailsLabel: 'Ver desglose',
        reserveLabel: 'Reservar',
      },
      {
        imageUrl: 'assets/images/town.webp',
        location: 'Tailandia, Asia',
        duration: '14 días',
        title: 'Aventura en las Islas Phi Phi',
        priceLabel: 'Desde',
        price: '1.150,00 €',
        detailsLabel: 'Ver desglose',
        reserveLabel: 'Reservar',
      },
    ],
  },
];
