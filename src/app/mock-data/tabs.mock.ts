export interface TabIcon {
  name: string;
  style?: string;
}

export interface Tab {
  title: string;
  icon?: TabIcon;
}

export const TABS: Tab[] = [
  {
    title: 'Aventura',
    icon: { name: 'mountains', style: ' fill: none;' },
  },
  {
    title: 'Destinos',
    icon: { name: 'world', style: '  fill: none;' },
  },
  {
    title: 'Alojamiento ',
    icon: { name: 'house', style: 'fill: none;' },
  },
  {
    title: 'Sobre Nosotros',
  },
];
