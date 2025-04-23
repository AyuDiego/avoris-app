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
import { PositionService } from 'src/app/core/services/position.service';
import { IconComponent } from '../icon/icon.component';

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
  // Inputs
  readonly title = input.required<string>();
  readonly duration = input.required<string>();
  readonly items = input.required<BreakdownItem[]>();
  readonly finalPriceLabel = input<string>('Precio final');
  readonly finalPrice = input.required<string>();
  readonly triggerElement = input<HTMLElement | null>(null);

  // Outputs
  readonly closeModal = output<void>();

  // Propiedades públicas
  readonly isPopupMode = signal(false);

  // Servicios inyectados
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly positionService = inject(PositionService);
  private readonly document = inject(DOCUMENT);

  // Propiedades privadas
  private mediaQueryList: MediaQueryList | null = null;
  private clickListenerUnlisten: (() => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    this.setupResponsiveMode();
    this.setupResizeObserver();
    this.setupPositioningEffect();
  }

  // Hooks del ciclo de vida
  ngOnDestroy(): void {
    this.removeClickOutsideListener();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  // Métodos públicos
  onClose(): void {
    this.closeModal.emit();
  }

  // Métodos privados
  private setupResponsiveMode(): void {
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
  }

  private setupResizeObserver(): void {
    if (typeof window !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.isPopupMode() && this.triggerElement()) {
          this.updatePosition();
        }
      });
      this.resizeObserver.observe(this.document.body);
    }
  }

  private setupPositioningEffect(): void {
    effect((onCleanup) => {
      const isPopup = this.isPopupMode();
      const trigger = this.triggerElement();
      const hostElement = this.el.nativeElement;

      const timerId = setTimeout(() => {
        if (isPopup && trigger) {
          this.positionService.positionElementRelativeToTrigger(
            trigger,
            hostElement,
            this.renderer
          );
          this.setupClickOutsideListener();
        } else {
          this.positionService.resetElementPosition(hostElement, this.renderer);
          this.removeClickOutsideListener();
        }
      }, 0);

      onCleanup(() => {
        clearTimeout(timerId);
        this.removeClickOutsideListener();
      });
    });
  }

  private updatePosition(): void {
    const trigger = this.triggerElement();
    const hostElement = this.el.nativeElement;

    if (this.isPopupMode() && trigger) {
      this.positionService.positionElementRelativeToTrigger(
        trigger,
        hostElement,
        this.renderer
      );
    }
  }

  private setupClickOutsideListener(): void {
    this.removeClickOutsideListener();
    const trigger = this.triggerElement();
    const excluded = trigger ? [trigger] : [];

    this.clickListenerUnlisten = this.positionService.addClickOutsideListener(
      this.el.nativeElement,
      this.renderer,
      () => this.onClose(),
      excluded
    );
  }

  private removeClickOutsideListener(): void {
    if (this.clickListenerUnlisten) {
      this.clickListenerUnlisten();
      this.clickListenerUnlisten = null;
    }
  }
}
