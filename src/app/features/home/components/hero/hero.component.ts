import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ButtonsComponent, SliderIndicatorComponent } from '@avoris/avoris-ui';
import { HERO_SLIDES, Slide } from 'src/app/mock-data/hero-slides.mock';
import { fadeInBackground } from './hero.animations';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, SliderIndicatorComponent, ButtonsComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  animations: [fadeInBackground],
})
export class HeroComponent {
  currentSlideIndex = signal(0);
  slides = signal<Slide[]>(HERO_SLIDES);

  onPrev(): void {
    this.currentSlideIndex.update((index) =>
      index === 0 ? this.slides().length - 1 : index - 1
    );
  }

  onNext(): void {
    this.currentSlideIndex.update((index) =>
      index === this.slides().length - 1 ? 0 : index + 1
    );
  }

  onIndicatorClick(index: number): void {
    this.currentSlideIndex.set(index);
  }
}
