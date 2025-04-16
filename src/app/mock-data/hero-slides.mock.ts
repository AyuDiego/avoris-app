export interface Slide {
    title: string;
    subtitle: string;
    buttonText: string;
    image: string;
  }
  
  export const HERO_SLIDES: Slide[] = [
    {
      title: 'Ruta por Australia',
      subtitle: 'Si te va la aventura, no te lo puedes perder',
      buttonText: 'Más información',
      image: 'assets/images/first-walp.webp',
    },
    {
      title: 'Aventura en Nueva Zelanda',
      subtitle: 'Descubre los paisajes más impresionantes',
      buttonText: 'Explorar',
      image: 'assets/images/second-walp.webp',
    },
    {
      title: 'Viaje a Japón',
      subtitle: 'Sumérgete en una cultura fascinante',
      buttonText: 'Reservar',
      image: 'assets/images/first-walp.webp',
    },
  ];