import { Component, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
export type ButtonType = 'btn' | 'slider' | 'filter' | 'accordion-trigger';
export type ButtonStyle = 'primary' | 'secondary' | 'outline';
export type ButtonSize = 'sm' | 'base' | 'lg';
export type SliderDirection = 'prev' | 'next';

@Component({
  selector: 'app-buttons',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.scss',
})
export class ButtonsComponent {
  readonly buttonType = input<ButtonType>('btn');
  readonly label = input<string>('Click Me');
  readonly buttonStyle = input<ButtonStyle>('primary');
  readonly size = input<ButtonSize>('base');
  readonly disabled = input<boolean>(false);
  readonly sliderDirection = input<SliderDirection>();
  readonly isOpen = input<boolean>(false);

  readonly previousClicked = output<void>();
  readonly nextClicked = output<void>();
  readonly toggle = output<void>();
  onSliderClick(): void {
    if (this.sliderDirection() === 'prev') {
      this.previousClicked.emit();
    } else if (this.sliderDirection() === 'next') {
      this.nextClicked.emit();
    }
  }
  onAccordionToggle(): void {
    this.toggle.emit();
  }
}
