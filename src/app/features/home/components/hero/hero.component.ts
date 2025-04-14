import { Component } from '@angular/core';
import { IconComponent, InfoTooltipComponent } from '@avoris/avoris-ui'; 

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [IconComponent, InfoTooltipComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {

}
