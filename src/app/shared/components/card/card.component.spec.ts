import { registerLocaleData } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import localeEs from '@angular/common/locales/es';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardData } from 'src/app/mock-data/cards.mock';
import { CardComponent } from './card.component';

registerLocaleData(localeEs);

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  const mockCardData: CardData = {
    imageUrl: 'assets/images/bangkok.webp',
    tagText: 'Oferta Especial',
    location: 'Ciudad Ejemplo',
    duration: '7 días',
    title: 'Viaje Increíble',
    priceLabel: 'Desde',
    price: 999,
    detailsLabel: 'Ver Detalles',
    reserveLabel: 'Reservar Ahora',
    priceDetails: {
      beforeTax: '€850',
      tax: '€149',
      other: 'Tasas incluidas',
      final: '€999',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('data', mockCardData);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the card title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.c-card__title')?.textContent).toContain(
      mockCardData.title
    );
  });

  it('should display the card price label and price', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    const labelElement = compiled.querySelector('.c-card__price-label');
    expect(labelElement)
      .withContext(
        "Price label element with selector '.c-card__price-label' not found."
      )
      .not.toBeNull();
    if (labelElement) {
      expect(labelElement.textContent).toContain(mockCardData.priceLabel);
    }

    const valueElement = compiled.querySelector('.c-card__price-value');
    expect(valueElement)
      .withContext(
        "Price value element with selector '.c-card__price-value' not found."
      )
      .not.toBeNull();
    if (valueElement) {
      expect(valueElement.textContent).toContain(mockCardData.price.toString());
    }
  });

  it('should display the card price label and price formatted for es-ES', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    const labelElement = compiled.querySelector('.c-card__price-label');
    expect(labelElement)
      .withContext(
        "Price label element with selector '.c-card__price-label' not found."
      )
      .not.toBeNull();
    if (labelElement) {
      expect(labelElement.textContent).toContain(mockCardData.priceLabel);
    }

    const valueElement = compiled.querySelector('.c-card__price-value');
    expect(valueElement)
      .withContext(
        "Price value element with selector '.c-card__price-value' not found."
      )
      .not.toBeNull();
    if (valueElement) {
      expect(valueElement.textContent).toContain('€');
      expect(valueElement.textContent).toContain(mockCardData.price.toString());
    }
  });

  it('should display the location', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.c-card__location')?.textContent).toContain(
      mockCardData.location
    );
  });

  it('should display the duration', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.c-card__duration')?.textContent).toContain(
      mockCardData.duration
    );
  });

  it('should display the tag text if provided', () => {
    if (mockCardData.tagText) {
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.querySelector('.c-card__tag')?.textContent).toContain(
        mockCardData.tagText
      );
    } else {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.c-card__tag')).toBeNull();
    }
  });

  it('should create breakdown items from card data', () => {
    const items = component.breakdownItems();
    expect(items.length).toBe(3);
    expect(items[0].label).toBe('Precio antes de impuestos');
    expect(items[0].value).toBe(mockCardData.priceDetails!.beforeTax);
    expect(items[1].label).toBe('Impuesto');
    expect(items[1].value).toBe(mockCardData.priceDetails!.tax);
    expect(items[2].label).toBe('Lorem ipsum');
    expect(items[2].value).toBe(mockCardData.priceDetails!.other);
  });

  it('should set "N/A" for missing breakdown item values', () => {
    const cardWithMissingDetails: CardData = {
      ...mockCardData,
      priceDetails: {
        beforeTax: undefined as any,
        tax: undefined as any,
        other: undefined as any,
        final: undefined as any,
      },
    };

    fixture.componentRef.setInput('data', cardWithMissingDetails);
    fixture.detectChanges();

    const items = component.breakdownItems();
    expect(items[0].value).toBe('N/A');
    expect(items[1].value).toBe('N/A');
    expect(items[2].value).toBe('N/A');
  });

  it('should use priceDetails.final when available', () => {
    expect(component.finalPriceValue()).toBe(mockCardData.priceDetails!.final);
  });

  it('should format price with CurrencyPipe when final price is not available', () => {
    const cardWithoutFinalPrice: CardData = {
      ...mockCardData,
      price: 1234.56,
      priceDetails: {
        ...mockCardData.priceDetails!,
        final: undefined as any,
      },
    };

    fixture.componentRef.setInput('data', cardWithoutFinalPrice);
    fixture.detectChanges();

    expect(component.finalPriceValue()).toContain('1.234,56');
    expect(component.finalPriceValue()).toContain('€');
  });

  it('should emit detailsClicked when onDetailsClick is called', () => {
    spyOn(component.detailsClicked, 'emit');
    component.onDetailsClick();
    expect(component.detailsClicked.emit).toHaveBeenCalled();
  });

  it('should emit reserveClicked when onReserveClick is called', () => {
    spyOn(component.reserveClicked, 'emit');
    component.onReserveClick();
    expect(component.reserveClicked.emit).toHaveBeenCalled();
  });

  it('should toggle isDetailsOpen state when called without event', () => {
    expect(component.isDetailsOpen()).toBeFalse();
    component.toggleDetails();
    expect(component.isDetailsOpen()).toBeTrue();
    component.toggleDetails();
    expect(component.isDetailsOpen()).toBeFalse();
  });

  it('should close modal when called with event from same trigger element that opened it', () => {
    component.isDetailsOpen.set(true);

    const mockElement = document.createElement('button');
    const mockEvent = { target: mockElement } as unknown as Event;

    (component as any).currentTriggerElement = mockElement;

    component.toggleDetails(mockEvent);

    expect(component.isDetailsOpen()).toBeFalse();
  });

  it('should update currentTriggerElement and open modal when called with new event', () => {
    const mockElement = document.createElement('button');
    const mockEvent = { target: mockElement } as unknown as Event;

    component.toggleDetails(mockEvent);

    expect(component.isDetailsOpen()).toBeTrue();
    expect((component as any).currentTriggerElement).toBe(mockElement);
  });

  it('should ignore non-HTMLElement event targets', () => {
    const mockEvent = { target: {} } as unknown as Event;

    component.toggleDetails(mockEvent);

    expect(component.isDetailsOpen()).toBeTrue();
    expect((component as any).currentTriggerElement).toBeNull();
  });
});
