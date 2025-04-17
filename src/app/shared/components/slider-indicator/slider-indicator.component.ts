import { Component, input, output } from '@angular/core';

@Component({
    selector: 'app-slider-indicator',
    imports: [],
    templateUrl: './slider-indicator.component.html',
    styleUrl: './slider-indicator.component.scss'
})
export class SliderIndicatorComponent {
  readonly currentIndex = input.required<number>();
  readonly totalSlides = input.required<number>();
  readonly indicatorClicked = output<number>();

  onIndicatorClick(index: number): void { 
    this.indicatorClicked.emit(index);
  }

}
