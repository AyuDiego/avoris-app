import { Component, input } from '@angular/core'; 
import { IconComponent } from '../icon/icon.component';

@Component({
    selector: 'app-info-tooltip',
    imports: [IconComponent],
    templateUrl: './info-tooltip.component.html',
    styleUrl: './info-tooltip.component.scss'
})
export class InfoTooltipComponent { 
  readonly content = input.required<string>();  
  readonly iconName = input<string>('info-tooltip'); 
}
