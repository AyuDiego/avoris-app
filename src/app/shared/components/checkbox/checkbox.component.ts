import { Component, input, signal, model } from '@angular/core';
import {
  InfoTooltipComponent
} from '@avoris/avoris-ui';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [InfoTooltipComponent],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss'
})
export class CheckboxComponent {
  readonly label = input<string>('');
  readonly tooltip = input<string>(''); 
  readonly checked = model<boolean>(false);
 
  readonly hover = signal(false);
 
  toggleCheck(): void {
    this.checked.update(value => !value);
  }
}
