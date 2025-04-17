import { Component, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export type TextInputType = 'filter-input-text' | 'nav-tab-main' | 'icon-input';
export type TextInputSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'app-text-input',
    imports: [IconComponent],
    templateUrl: './text-input.component.html',
    styleUrl: './text-input.component.scss'
})
export class TextInputComponent {
  readonly type = input<TextInputType>('filter-input-text');
  readonly leftIcon = input<string>('');
  readonly iconStyle = input<string>('fill:none;');
  readonly label = input<string>('Entrada');
  readonly placeholder = input<string>('Escribe aquí...');
  readonly value = input<string>('');
  readonly size = input<TextInputSize>('sm');
  readonly disabled = input<boolean>(false);
  readonly navTabClass = input<string>('custom-nav-tab-color');

  readonly title = input<string>('');
  readonly chevronDown = input<boolean>(false);
  readonly rightIcon = input<string>('chevron-down');
  readonly rightIconStyle = input<string>('');
  readonly chevronClicked = output<void>();

  readonly inputValue = input<string>(''); 
  readonly inputValueChange = output<string>();

  onInternalInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.inputValueChange.emit(target.value);
  }
}
