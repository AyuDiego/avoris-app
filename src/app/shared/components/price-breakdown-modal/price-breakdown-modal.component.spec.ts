import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  PriceBreakdownModalComponent,
  BreakdownItem,
} from './price-breakdown-modal.component';
import { IconComponent } from '../icon/icon.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

describe('PriceBreakdownModalComponent', () => {
  let component: PriceBreakdownModalComponent;
  let fixture: ComponentFixture<PriceBreakdownModalComponent>;
  let mockDocument: Document;

  const mockBreakdownItems: BreakdownItem[] = [
    { label: 'Precio antes de impuestos', value: '850 €' },
    { label: 'Impuesto', value: '149 €' },
    { label: 'Lorem ipsum', value: 'Tasas incluidas' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceBreakdownModalComponent],
      providers: [provideHttpClient(withFetch())],
    }).compileComponents();

    fixture = TestBed.createComponent(PriceBreakdownModalComponent);
    component = fixture.componentInstance;

    mockDocument = TestBed.inject(DOCUMENT);

    fixture.componentRef.setInput('title', 'Test Location');
    fixture.componentRef.setInput('duration', '7 días');
    fixture.componentRef.setInput('items', mockBreakdownItems);
    fixture.componentRef.setInput('finalPrice', '999 €');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title and duration', () => {
    const titleElement = fixture.debugElement.query(
      By.css('.c-price-breakdown-modal__item-title')
    );
    const durationElement = fixture.debugElement.query(
      By.css('.c-price-breakdown-modal__item-duration')
    );

    expect(titleElement.nativeElement.textContent).toContain('Test Location');
    expect(durationElement.nativeElement.textContent).toContain('7 días');
  });

  it('should render all breakdown items', () => {
    const listItems = fixture.debugElement.queryAll(
      By.css('.c-price-breakdown-modal__list-item')
    );

    expect(listItems.length).toBe(mockBreakdownItems.length);

    listItems.forEach((item, index) => {
      const label = item.query(By.css('.c-price-breakdown-modal__item-label'));
      const value = item.query(By.css('.c-price-breakdown-modal__item-value'));

      expect(label.nativeElement.textContent).toContain(
        mockBreakdownItems[index].label
      );
      expect(value.nativeElement.textContent).toContain(
        mockBreakdownItems[index].value
      );
    });
  });

  it('should display the final price and label', () => {
    const finalLabel = fixture.debugElement.query(
      By.css('.c-price-breakdown-modal__final-label')
    );
    const finalValue = fixture.debugElement.query(
      By.css('.c-price-breakdown-modal__final-value')
    );

    expect(finalLabel.nativeElement.textContent).toContain('Precio final');
    expect(finalValue.nativeElement.textContent).toContain('999 €');

    fixture.componentRef.setInput('finalPriceLabel', 'Total');
    fixture.detectChanges();

    expect(finalLabel.nativeElement.textContent).toContain('Total');
  });

  it('should emit closeModal when onClose is called', () => {
    spyOn(component.closeModal, 'emit');

    component.onClose();

    expect(component.closeModal.emit).toHaveBeenCalled();
  });

  it('should close modal when close button is clicked', () => {
    spyOn(component, 'onClose');

    const closeButton = fixture.debugElement.query(
      By.css('.c-price-breakdown-modal__close-btn')
    );
    closeButton.triggerEventHandler('click', null);

    expect(component.onClose).toHaveBeenCalled();
  });

  it('should have popup mode disabled by default on mobile', () => {
    spyOn(window, 'matchMedia').and.returnValue({
      matches: false,
      addEventListener: jasmine.createSpy(),
      removeEventListener: jasmine.createSpy(),
    } as any);

    fixture = TestBed.createComponent(PriceBreakdownModalComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('title', 'Test Location');
    fixture.componentRef.setInput('duration', '7 días');
    fixture.componentRef.setInput('items', mockBreakdownItems);
    fixture.componentRef.setInput('finalPrice', '999 €');

    fixture.detectChanges();

    expect(component.isPopupMode()).toBeFalse();
  });

  it('should have popup mode enabled on tablet/desktop', () => {
    spyOn(window, 'matchMedia').and.returnValue({
      matches: true,
      addEventListener: jasmine.createSpy(),
      removeEventListener: jasmine.createSpy(),
    } as any);

    fixture = TestBed.createComponent(PriceBreakdownModalComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('title', 'Test Location');
    fixture.componentRef.setInput('duration', '7 días');
    fixture.componentRef.setInput('items', mockBreakdownItems);
    fixture.componentRef.setInput('finalPrice', '999 €');

    fixture.detectChanges();

    expect(component.isPopupMode()).toBeTrue();
  });

  it('should clean up event listeners on destroy', () => {
    const spy = spyOn<any>(component, 'removeClickOutsideListener');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
  });

  it('should position itself relative to the trigger element', () => {
    const mockTriggerEl = document.createElement('button');
    mockTriggerEl.getBoundingClientRect = () => ({
      bottom: 100,
      left: 50,
      width: 100,
      height: 30,
      right: 150,
      top: 70,
      x: 50,
      y: 70,
      toJSON: () => {},
    });

    document.body.appendChild(mockTriggerEl);

    fixture.componentRef.setInput('triggerElement', mockTriggerEl);

    component.isPopupMode.set(true);
    fixture.detectChanges();

    const hostElement = fixture.debugElement.nativeElement;

    expect(hostElement.style.position).toBe('absolute');
    expect(hostElement.style.top).toBeTruthy();
    expect(hostElement.style.left).toBeTruthy();
    expect(hostElement.style.zIndex).toBe('1050');

    const topValue = parseInt(hostElement.style.top);
    const leftValue = parseInt(hostElement.style.left);
    expect(topValue).toBeGreaterThan(
      mockTriggerEl.getBoundingClientRect().bottom
    );
    expect(leftValue).toBe(mockTriggerEl.getBoundingClientRect().left);

    expect(hostElement.style.top).toBe('112px');
    expect(hostElement.style.left).toBe('50px');

    document.body.removeChild(mockTriggerEl);
  });
});
