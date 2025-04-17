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
import { IconComponent } from '@avoris/avoris-ui';

export interface BreakdownItem {
  label: string;
  value: string;
}

@Component({
  selector: 'app-price-breakdown-modal',
  imports: [CommonModule, IconComponent],
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

  private readonly el = inject(ElementRef<HTMLElement>);
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

  /**
   * Posiciona el popup justo debajo del triggerElement.
   * Si el modal está dentro de un contenedor con position: relative, calcula la posición relativa a ese contenedor.
   * Si está en el body, calcula la posición absoluta respecto al documento.
   */
  private positionPopup(
    triggerEl: HTMLElement,
    hostElement: HTMLElement
  ): void {
    const triggerRect = triggerEl.getBoundingClientRect();
    let offsetParent = hostElement.offsetParent as HTMLElement | null;
    if (!offsetParent) offsetParent = document.body;

    const parentRect = offsetParent.getBoundingClientRect();

    let top = triggerRect.bottom - parentRect.top + 4;
    let left = triggerRect.left - parentRect.left;

    const parentWidth =
      offsetParent === document.body
        ? window.innerWidth
        : offsetParent.offsetWidth;

    this.renderer.setStyle(hostElement, 'position', 'absolute');
    this.renderer.setStyle(hostElement, 'top', `${top}px`);
    this.renderer.setStyle(hostElement, 'left', `${left}px`);
    this.renderer.setStyle(hostElement, 'transform', 'none');
    this.renderer.setStyle(hostElement, 'z-index', '1050');
  }

  private resetPosition(hostElement: HTMLElement): void {
    this.renderer.removeStyle(hostElement, 'position');
    this.renderer.removeStyle(hostElement, 'top');
    this.renderer.removeStyle(hostElement, 'left');
    this.renderer.removeStyle(hostElement, 'width');
    this.renderer.removeStyle(hostElement, 'transform');
    this.renderer.removeStyle(hostElement, 'z-index');
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
