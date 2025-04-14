import { Component, input } from '@angular/core';
import { IconComponent } from '@avoris/avoris-ui'; 

@Component({
  selector: 'app-info-tooltip',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './info-tooltip.component.html',
  styleUrl: './info-tooltip.component.scss'
})
export class InfoTooltipComponent { 
  readonly content = input.required<string>();  
  readonly iconName = input<string>('info-tooltip'); 
}
