import { CurrencyPipe } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  input,
  OnDestroy,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import {
  BreakdownItem,
  ButtonsComponent,
  IconComponent,
  PriceBreakdownModalComponent,
  TagComponent,
  TextInputComponent,
} from '@avoris/avoris-ui';
import { CardData } from 'src/app/mock-data/cards.mock';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CurrencyPipe,
    IconComponent,
    ButtonsComponent,
    TagComponent,
    TextInputComponent,
    PriceBreakdownModalComponent,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent implements OnDestroy {
  readonly data = input.required<CardData>();

  readonly detailsClicked = output<void>();
  readonly reserveClicked = output<void>();
  readonly isDetailsOpen = signal(false);

  @ViewChild('detailsBtnRef') detailsButtonRef:
    | ElementRef<HTMLElement>
    | undefined;

  readonly triggerElementRef = signal<HTMLElement | null>(null);

  readonly isTablet = signal(window.matchMedia('(min-width: 744px)').matches);
  private _mql = window.matchMedia('(min-width: 744px)');

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
    return cardData.priceDetails?.final ?? cardData.price;
  });

  constructor() {
    this._mql.addEventListener('change', (e) => this.isTablet.set(e.matches));

    afterNextRender(() => {
      if (this.detailsButtonRef) {
        this.triggerElementRef.set(this.detailsButtonRef.nativeElement);
      }
    });
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  onDetailsClick(): void {
    this.detailsClicked.emit();
  }

  onReserveClick(): void {
    this.reserveClicked.emit();
  }

  toggleDetails(): void {
    this.isDetailsOpen.update((open) => !open);
    console.log('Details toggled, new state:', this.isDetailsOpen());
  }
}
