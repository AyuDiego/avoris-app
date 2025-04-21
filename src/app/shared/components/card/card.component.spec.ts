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
});
