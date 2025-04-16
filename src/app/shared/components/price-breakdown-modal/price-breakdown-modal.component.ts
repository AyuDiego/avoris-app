import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  Renderer2,
  signal,
} from '@angular/core';
import { ButtonsComponent, IconComponent } from '@avoris/avoris-ui';

export interface BreakdownItem {
  label: string;
  value: string;
}

@Component({
  selector: 'app-price-breakdown-modal',
  standalone: true,
  imports: [CommonModule, ButtonsComponent, IconComponent],
  templateUrl: './price-breakdown-modal.component.html',
  styleUrl: './price-breakdown-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceBreakdownModalComponent implements OnDestroy {
  readonly title = input.required<string>();
  readonly duration = input.required<string>();
  readonly items = input.required<BreakdownItem[]>();
  readonly finalPriceLabel = input<string>('Precio final');
  readonly finalPrice = input.required<string>();
  readonly triggerElement = input<HTMLElement | null>(null);

  readonly closeModal = output<void>();

  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);

  readonly isPopupMode = signal(false);
  private mediaQueryList: MediaQueryList | null = null;
  private clickListenerUnlisten: (() => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.mediaQueryList = window.matchMedia('(min-width: 744px)');
      this.isPopupMode.set(this.mediaQueryList.matches);

      this.renderer.listen(
        this.mediaQueryList,
        'change',
        (event: MediaQueryListEvent) => {
          this.isPopupMode.set(event.matches);
        }
      );
    }

    effect((onCleanup) => {
      const isPopup = this.isPopupMode();
      const trigger = this.triggerElement();
      const hostElement = this.el.nativeElement;

      if (isPopup && trigger) {
        this.positionPopup(trigger, hostElement);
        setTimeout(() => {
          if (this.isPopupMode()) {
            this.addClickOutsideListener();
          }
        }, 0);
      } else {
        this.resetPosition(hostElement);
        this.removeClickOutsideListener();
      }

      onCleanup(() => {
        this.removeClickOutsideListener();
      });
    });
  }

  ngOnDestroy(): void {
    this.removeClickOutsideListener();
  }

  private positionPopup(
    triggerEl: HTMLElement,
    hostElement: HTMLElement
  ): void {
    const triggerRect = triggerEl.getBoundingClientRect();
    const top = triggerRect.bottom + window.scrollY + 5;
    let left = triggerRect.left + window.scrollX;

    if (this.isPopupMode()) {
      const modalWidth = hostElement.offsetWidth;
      const windowWidth = window.innerWidth;

      if (left + modalWidth > windowWidth) {
        left = windowWidth - modalWidth - 10;
        left = Math.max(left, 10);
      }
    }

    this.renderer.setStyle(hostElement, 'top', `${top}px`);
    this.renderer.setStyle(hostElement, 'left', `${left}px`);
  }

  private resetPosition(hostElement: HTMLElement): void {
    this.renderer.removeStyle(hostElement, 'top');
    this.renderer.removeStyle(hostElement, 'left');
  }

  private handleClickOutside = (event: MouseEvent) => {
    if (
      this.isPopupMode() &&
      !this.el.nativeElement.contains(event.target as Node)
    ) {
      this.onClose();
    }
  };

  private addClickOutsideListener(): void {
    if (!this.clickListenerUnlisten && typeof document !== 'undefined') {
      this.clickListenerUnlisten = this.renderer.listen(
        this.document,
        'click',
        this.handleClickOutside
      );
    }
  }

  private removeClickOutsideListener(): void {
    if (this.clickListenerUnlisten) {
      this.clickListenerUnlisten();
      this.clickListenerUnlisten = null;
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }
}
