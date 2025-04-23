import { CurrencyPipe } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy, 
  afterNextRender,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild
} from '@angular/core';

import { CardData } from 'src/app/mock-data/cards.mock';
import { ButtonsComponent } from '../buttons/buttons.component';
import {
  BreakdownItem,
  PriceBreakdownModalComponent,
} from '../price-breakdown-modal/price-breakdown-modal.component';
import { TagComponent } from '../tag/tag.component';

@Component({
  selector: 'app-card',
  imports: [
    CurrencyPipe,
    ButtonsComponent,
    TagComponent,
    PriceBreakdownModalComponent,
  ],
  providers: [CurrencyPipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent implements OnDestroy {
  readonly detailsButtonRef = viewChild.required<ElementRef<HTMLElement>>('detailsBtnRef');
  readonly data = input.required<CardData>();
  readonly detailsClicked = output<void>();
  readonly reserveClicked = output<void>();
  readonly isDetailsOpen = signal(false);
  readonly triggerElementRef = signal<HTMLElement | null>(null);
  readonly isTablet = signal(window.matchMedia('(min-width: 744px)').matches);
  readonly breakdownItems = computed<BreakdownItem[]>(() => {
    const cardData = this.data();
    return [
      {
        label: 'Precio antes de impuestos',
        value: cardData.priceDetails?.beforeTax ?? 'N/A',
      },
      { label: 'Impuesto', value: cardData.priceDetails?.tax ?? 'N/A' },
      { label: 'Lorem ipsum', value: cardData.priceDetails?.other ?? 'N/A' },
    ];
  });
  readonly finalPriceValue = computed<string>(() => {
    const cardData = this.data();
    if (cardData.priceDetails?.final) {
      return cardData.priceDetails.final;
    }
    return (
      this.currencyPipe.transform(
        cardData.price,
        'EUR',
        'symbol',
        '1.2-2',
        'es-ES'
      ) ?? 'N/A'
    );
  });

  private readonly currencyPipe = inject(CurrencyPipe);
  private readonly _mql = window.matchMedia('(min-width: 744px)');
  private readonly _mqlListener = (e: MediaQueryListEvent) =>
    this.isTablet.set(e.matches);
  private currentTriggerElement: HTMLElement | null = null;

  constructor() {
    this._mql.addEventListener('change', this._mqlListener);

    afterNextRender(() => { 
      this.triggerElementRef.set(this.detailsButtonRef().nativeElement);
    });
  }

  ngOnDestroy(): void {
    this._mql.removeEventListener('change', this._mqlListener);
  }

  onDetailsClick(): void {
    this.detailsClicked.emit();
  }

  onReserveClick(): void {
    this.reserveClicked.emit();
  }

  toggleDetails(event?: Event): void {
    const oldState = this.isDetailsOpen();
    
    if (oldState && event && 
        event.target instanceof HTMLElement && 
        this.currentTriggerElement === event.target) {
      this.isDetailsOpen.set(false);
    } else {
      if (event && event.target instanceof HTMLElement) {
        this.currentTriggerElement = event.target;
      }
      this.isDetailsOpen.set(!oldState);
    }
  }
}
