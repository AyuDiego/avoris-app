import { trigger, transition, style, animate } from '@angular/animations';

export const fadeInBackground = trigger('fadeInBackground', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('1.5s ease', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    animate('1.5s ease', style({ opacity: 0 }))
  ])
]);