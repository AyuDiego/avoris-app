import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { take } from 'rxjs';
import { IconRegistryService } from 'src/app/core/services/icon-registry.service';

@Component({
  selector: 'app-icon',
  imports: [CommonModule],
  template: `<span [innerHTML]="svgContent()" class="icon-wrapper"></span>`,
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  private iconRegistry = inject(IconRegistryService);

  readonly svgContent = signal<SafeHtml | null>(null);

  readonly name = input.required<string>();

  constructor() {
    effect(() => {
      const name = this.name();
      if (name) {
        this.iconRegistry
          .loadIcon(name)
          .pipe(take(1))
          .subscribe({
            next: (svg) => this.svgContent.set(svg),
            error: (err) => {
              console.error(`Error loading icon '${name}':`, err);
              this.svgContent.set(null);
            },
          });
      } else {
        this.svgContent.set(null);
      }
    });
  }
}
