import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { PositionService } from 'src/app/core/services/position.service';
import {
  BreakdownItem,
  PriceBreakdownModalComponent,
} from './price-breakdown-modal.component';
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

  it('should position itself relative to the trigger element in popup mode', fakeAsync(() => {
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

    const mockTriggerEl = document.createElement('button');

    if (!jasmine.isSpy(mockTriggerEl.getBoundingClientRect)) {
      spyOn(mockTriggerEl, 'getBoundingClientRect').and.returnValue({
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
    }

    if (!jasmine.isSpy(document.body.getBoundingClientRect)) {
      spyOn(document.body, 'getBoundingClientRect').and.returnValue({
        top: 0,
        left: 0,
        bottom: 800,
        right: 600,
        height: 800,
        width: 600,
        x: 0,
        y: 0,
        toJSON: () => {},
      });
    }

    fixture.componentRef.setInput('triggerElement', mockTriggerEl);
    fixture.detectChanges();

    tick();
    fixture.detectChanges();

    const hostElement = fixture.debugElement.nativeElement;

    expect(hostElement.style.position).toBe('absolute');
    expect(hostElement.style.opacity).toBe('1');
    expect(hostElement.style.display).toBe('block');
    expect(hostElement.style.zIndex).toBe('1050');
  }));
  it('should update isPopupMode when media query changes', () => {
    const mediaQueryMock = {
      matches: true,
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener'),
    };

    let mediaChangeListener: any;
    spyOn(window, 'matchMedia').and.returnValue({
      ...mediaQueryMock,
      addEventListener: (type: string, listener: any) => {
        if (type === 'change') mediaChangeListener = listener;
      },
    } as any);

    fixture = TestBed.createComponent(PriceBreakdownModalComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('title', 'Test Location');
    fixture.componentRef.setInput('duration', '7 días');
    fixture.componentRef.setInput('items', mockBreakdownItems);
    fixture.componentRef.setInput('finalPrice', '999 €');
    fixture.detectChanges();

    expect(component.isPopupMode()).toBeTrue();

    mediaChangeListener({ matches: false });
    expect(component.isPopupMode()).toBeFalse();

    mediaChangeListener({ matches: true });
    expect(component.isPopupMode()).toBeTrue();
  });

  it('should call updatePosition when ResizeObserver detects changes and conditions are met', fakeAsync(() => {
    let resizeCallback: () => void = () => {};
    const mockResizeObserver = {
      observe: jasmine.createSpy('observe'),
      disconnect: jasmine.createSpy('disconnect'),
    };
    (window as any).ResizeObserver = function (callback: any) {
      resizeCallback = callback;
      return mockResizeObserver;
    };

    spyOn<any>(PriceBreakdownModalComponent.prototype, 'updatePosition');

    fixture = TestBed.createComponent(PriceBreakdownModalComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('title', 'Test Location');
    fixture.componentRef.setInput('duration', '7 días');
    fixture.componentRef.setInput('items', mockBreakdownItems);
    fixture.componentRef.setInput('finalPrice', '999 €');

    const mockTriggerEl = document.createElement('button');
    fixture.componentRef.setInput('triggerElement', mockTriggerEl);

    (component as any).isPopupMode.set(true);

    fixture.detectChanges();

    if (resizeCallback) resizeCallback();
    tick();

    expect((component as any).updatePosition).toHaveBeenCalled();

    (component as any).isPopupMode.set(false);
    (component as any).updatePosition.calls.reset();

    if (resizeCallback) resizeCallback();
    tick();

    expect((component as any).updatePosition).not.toHaveBeenCalled();
  }));

  it('should reset element position when not in popup mode or no trigger element', fakeAsync(() => {
    const positionService = TestBed.inject(PositionService);
    spyOn(positionService, 'resetElementPosition');
    spyOn(positionService, 'positionElementRelativeToTrigger');
    spyOn<any>(component, 'removeClickOutsideListener');

    component.isPopupMode.set(false);
    fixture.componentRef.setInput('triggerElement', null);

    fixture.detectChanges();
    tick();

    expect(positionService.resetElementPosition).toHaveBeenCalled();
    expect(component['removeClickOutsideListener']).toHaveBeenCalled();
    expect(
      positionService.positionElementRelativeToTrigger
    ).not.toHaveBeenCalled();
  }));

  it('should position element relative to trigger when in popup mode with valid trigger', fakeAsync(() => {
    const positionService = TestBed.inject(PositionService);
    spyOn(positionService, 'positionElementRelativeToTrigger');
    spyOn<any>(component, 'setupClickOutsideListener');

    component.isPopupMode.set(true);
    const mockTriggerEl = document.createElement('button');
    fixture.componentRef.setInput('triggerElement', mockTriggerEl);

    (component as any).updatePosition();
    tick();

    expect(
      positionService.positionElementRelativeToTrigger
    ).toHaveBeenCalledWith(
      mockTriggerEl,
      component['el'].nativeElement,
      component['renderer']
    );
  }));

  it('should call onClose when clicking outside the modal', fakeAsync(() => {
    const positionService = TestBed.inject(PositionService);
    let capturedCallback: () => void = () => {};

    spyOn(positionService, 'addClickOutsideListener').and.callFake(
      (element, renderer, callback, excluded) => {
        capturedCallback = callback;
        return () => {};
      }
    );

    spyOn(component, 'onClose');

    (component as any).setupClickOutsideListener();

    if (capturedCallback) capturedCallback();
    tick();

    expect(component.onClose).toHaveBeenCalled();
  }));
});
