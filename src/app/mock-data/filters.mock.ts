
export interface TagFilter {
    label: string; 
    key: string;  
  }
  
  // filters adventure
  export const ALL_TAG_FILTERS: TagFilter[] = [
    { label: 'Quads', key: 'Quads' },
    { label: 'Parapente', key: 'Parapente' },
    { label: 'Rafting', key: 'Rafting' },
    { label: 'Explora', key: 'Explora' },
    { label: 'Buceo', key: 'Buceo' },
    { label: 'Paracaidas', key: 'Paracaidas' },
    { label: 'SnowBoard', key: 'SnowBoard' },
    { label: 'Surf', key: 'Surf' },
    { label: 'Kayak', key: 'Kayak' },
    { label: 'Senderismo', key: 'Senderismo' },
    { label: 'Escalada', key: 'Escalada' },
    { label: 'Ciclismo', key: 'Ciclismo' },
    { label: 'Esquí', key: 'Esquí' },
    { label: 'Windsurf', key: 'Windsurf' },
    { label: 'Kitesurf', key: 'Kitesurf' },
    { label: 'Barranquismo', key: 'Barranquismo' },
    { label: 'Espeleología', key: 'Espeleología' },
    { label: 'Montañismo', key: 'Montañismo' },
    { label: 'Puenting', key: 'Puenting' },
    { label: 'Trekking', key: 'Trekking' },
    { label: 'Orientación', key: 'Orientación' },
    { label: 'Geocaching', key: 'Geocaching' },
    { label: 'Paddle Surf', key: 'Paddle Surf' },
    { label: 'Moto Acuática', key: 'Moto Acuática' },
    { label: 'Vela', key: 'Vela' },
    { label: 'Pesca Deportiva', key: 'Pesca Deportiva' },
    { label: 'Cabalgata', key: 'Cabalgata' },
    { label: 'Tiro con Arco', key: 'Tiro con Arco' },
    { label: 'Paintball', key: 'Paintball' },
  ];
  
  export const INITIAL_VISIBLE_COUNT = 8;