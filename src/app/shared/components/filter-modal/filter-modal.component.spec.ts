import { DOCUMENT } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FilterService } from 'src/app/core/services/filter.service';
import {
  ALL_TAG_FILTERS,
  INITIAL_VISIBLE_COUNT,
} from 'src/app/mock-data/filters.mock';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { IconComponent } from '../icon/icon.component';
import { TextInputComponent } from '../text-input/text-input.component';
import { FilterModalComponent } from './filter-modal.component';

describe('FilterModalComponent', () => {
  let component: FilterModalComponent;
  let fixture: ComponentFixture<FilterModalComponent>;
  let filterService: FilterService;
  let document: Document;
  let renderer: Renderer2;

  let mockMediaQueryList: {
    matches: boolean;
    addEventListener: jasmine.Spy;
    removeEventListener: jasmine.Spy;
  };
  let mediaQueryCallback: (event: { matches: boolean }) => void = () => {};
  beforeEach(async () => {
    mockMediaQueryList = {
      matches: false,
      addEventListener: jasmine
        .createSpy('addEventListener')
        .and.callFake((type, listener, options) => {
          if (type === 'change' && typeof listener === 'function') {
            mediaQueryCallback = listener;
          }
        }),
      removeEventListener: jasmine.createSpy('removeEventListener'),
    };
    spyOn(window, 'matchMedia').and.returnValue(mockMediaQueryList as any);
    await TestBed.configureTestingModule({
      imports: [
        FilterModalComponent,
        NoopAnimationsModule,
        TextInputComponent,
        CheckboxComponent,
        IconComponent,
      ],
      providers: [provideHttpClient(withFetch()), FilterService],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterModalComponent);
    component = fixture.componentInstance;
    filterService = TestBed.inject(FilterService);
    document = TestBed.inject(DOCUMENT);
    renderer = fixture.componentRef.injector.get<Renderer2>(Renderer2 as any);
    fixture.componentRef.setInput('isOpen', true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show/hide header based on hideHeader input', () => {
    fixture.detectChanges();
    expect(component.hideHeader()).toBeFalse();
    expect(
      fixture.debugElement.query(By.css('.c-filter-modal__close-btn'))
    ).toBeTruthy();
    fixture.componentRef.setInput('hideHeader', true);
    fixture.detectChanges();
    expect(component.hideHeader()).toBeTrue();
    expect(
      fixture.debugElement.query(By.css('.c-filter-modal__close-btn'))
    ).toBeNull();
  });

  it('should toggle destination section', () => {
    expect(component.isDestinationOpen()).toBeFalse();
    component.toggleDestination();
    expect(component.isDestinationOpen()).toBeTrue();
    component.toggleDestination();
    expect(component.isDestinationOpen()).toBeFalse();
  });

  it('should toggle adventure section', () => {
    expect(component.isAdventureOpen()).toBeFalse();
    component.toggleAdventure();
    expect(component.isAdventureOpen()).toBeTrue();
    component.toggleAdventure();
    expect(component.isAdventureOpen()).toBeFalse();
  });

  it('should toggle accommodation section', () => {
    expect(component.isAccommodationOpen()).toBeFalse();
    component.toggleAccommodation();
    expect(component.isAccommodationOpen()).toBeTrue();
    component.toggleAccommodation();
    expect(component.isAccommodationOpen()).toBeFalse();
  });

  it('should toggle price section', () => {
    expect(component.isPriceOpen()).toBeFalse();
    component.togglePrice();
    expect(component.isPriceOpen()).toBeTrue();
    component.togglePrice();
    expect(component.isPriceOpen()).toBeFalse();
  });

  it('should limit visible adventure filters when not showing all', () => {
    component.showAllAdventureFilters.set(false);
    fixture.detectChanges();
    expect(component.visibleAdventureFilters().length).toBe(
      INITIAL_VISIBLE_COUNT
    );
  });

  it('should show all adventure filters when showAllAdventureFilters is true', () => {
    component.showAllAdventureFilters.set(true);
    fixture.detectChanges();
    expect(component.visibleAdventureFilters().length).toBe(
      ALL_TAG_FILTERS.length
    );
  });

  it('should calculate correct hidden filters count', () => {
    component.showAllAdventureFilters.set(false);
    fixture.detectChanges();
    const expectedHiddenCount = Math.max(
      0,
      ALL_TAG_FILTERS.length - INITIAL_VISIBLE_COUNT
    );
    expect(component.hiddenAdventureFiltersCount()).toBe(expectedHiddenCount);
  });

  it('should toggle showAllAdventureFilters', () => {
    expect(component.showAllAdventureFilters()).toBeFalse();
    component.toggleShowAllAdventureFilters();
    expect(component.showAllAdventureFilters()).toBeTrue();
    component.toggleShowAllAdventureFilters();
    expect(component.showAllAdventureFilters()).toBeFalse();
  });

  it('should call FilterService.updateTag when checkbox changes', () => {
    spyOn(filterService, 'updateTag');
    component.isAdventureOpen.set(true);
    fixture.detectChanges();

    const checkboxElement = fixture.debugElement.query(By.css('app-checkbox'));
    expect(checkboxElement).toBeTruthy();

    const testFilterKey = component.visibleAdventureFilters()[0].key;
    checkboxElement.triggerEventHandler('checkedChange', true);

    expect(filterService.updateTag).toHaveBeenCalledWith(testFilterKey, true);
  });

  it('should call FilterService.updateMinPrice when min price input changes', () => {
    spyOn(filterService, 'updateMinPrice');
    component.isPriceOpen.set(true);
    fixture.detectChanges();

    const priceInputs = fixture.debugElement.queryAll(
      By.css('app-text-input[type="icon-input"]')
    );
    const minPriceInput = priceInputs[0];
    expect(minPriceInput).toBeTruthy();

    minPriceInput.triggerEventHandler('inputValueChange', '100');

    expect(filterService.updateMinPrice).toHaveBeenCalledWith('100');
  });

  it('should call FilterService.updateMaxPrice when max price input changes', () => {
    spyOn(filterService, 'updateMaxPrice');
    component.isPriceOpen.set(true);
    fixture.detectChanges();

    const priceInputs = fixture.debugElement.queryAll(
      By.css('app-text-input[type="icon-input"]')
    );
    const maxPriceInput = priceInputs[1];
    expect(maxPriceInput).toBeTruthy();

    maxPriceInput.triggerEventHandler('inputValueChange', '500');

    expect(filterService.updateMaxPrice).toHaveBeenCalledWith('500');
  });

  it('should emit closeModal when onClose is called', () => {
    spyOn(component.closeModal, 'emit');
    component.onClose();
    expect(component.closeModal.emit).toHaveBeenCalled();
  });

  it('should call onClose when close button is clicked', () => {
    fixture.detectChanges();
    spyOn(component, 'onClose');
    fixture.componentRef.setInput('hideHeader', false);
    fixture.detectChanges();

    const closeButton = fixture.debugElement.query(
      By.css('.c-filter-modal__close-btn')
    );
    if (closeButton) {
      expect(closeButton).toBeTruthy();
      closeButton.triggerEventHandler('click', null);
      expect(component.onClose).toHaveBeenCalled();
    } else {
      fail('Close button not found. Check hideHeader input.');
    }
  });

  it('should call onClose when onApplyFilters is called', () => {
    fixture.detectChanges();
    spyOn(component, 'onClose');
    component.onApplyFilters();
    expect(component.onClose).toHaveBeenCalled();
  });

  it('should call FilterService.clearFilters when onClearFilters is called', () => {
    spyOn(filterService, 'clearFilters');
    component.onClearFilters();
    expect(filterService.clearFilters).toHaveBeenCalled();
  });

  it('should call toggleShowAllAdventureFilters when "Show More/Less" button is clicked', () => {
    spyOn(component, 'toggleShowAllAdventureFilters');
    component.isAdventureOpen.set(true);
    if (component.hiddenAdventureFiltersCount() > 0) {
      fixture.detectChanges();
      const showMoreButton = fixture.debugElement.query(
        By.css('.c-filter-modal__show-more')
      );
      expect(showMoreButton).toBeTruthy('Expected "Show More" button to exist');
      showMoreButton.triggerEventHandler('click', null);
      expect(component.toggleShowAllAdventureFilters).toHaveBeenCalled();
    } else {
      console.warn('Skipping "Show More" button test: No hidden filters.');
    }
  });

  it('should call toggleDestination when destination header is clicked', () => {
    fixture.detectChanges();
    spyOn(component, 'toggleDestination');
    const headers = fixture.debugElement.queryAll(
      By.directive(TextInputComponent)
    );
    const destinationHeader = headers.find(
      (h) => h.componentInstance.title() === 'Destinos'
    );

    if (!destinationHeader) {
      fail('Expected Destinos header, but it was not found.');
      return;
    }
    expect(destinationHeader).toBeTruthy('Expected Destinos header');

    const chevronButton = destinationHeader.query(
      By.css('.c-text-input-nav-bar__chevron')
    );
    if (!chevronButton) {
      fail('Expected chevron button in Destinos header, but it was not found.');
      return;
    }
    expect(chevronButton).toBeTruthy(
      'Expected chevron button in Destinos header'
    );
    chevronButton.triggerEventHandler('click', null);
    expect(component.toggleDestination).toHaveBeenCalled();
  });

  it('should call toggleAdventure when adventure header is clicked', () => {
    fixture.detectChanges();
    spyOn(component, 'toggleAdventure');
    const headers = fixture.debugElement.queryAll(
      By.directive(TextInputComponent)
    );
    const adventureHeader = headers.find(
      (h) => h.componentInstance.title() === 'Aventura'
    );

    if (!adventureHeader) {
      fail('Expected Aventura header, but it was not found.');
      return;
    }
    expect(adventureHeader).toBeTruthy('Expected Aventura header');

    const chevronButton = adventureHeader.query(
      By.css('.c-text-input-nav-bar__chevron')
    );
    if (!chevronButton) {
      fail('Expected chevron button in Aventura header, but it was not found.');
      return;
    }
    expect(chevronButton).toBeTruthy(
      'Expected chevron button in Aventura header'
    );
    chevronButton.triggerEventHandler('click', null);
    expect(component.toggleAdventure).toHaveBeenCalled();
  });

  it('should call toggleAccommodation when accommodation header is clicked', () => {
    fixture.detectChanges();
    spyOn(component, 'toggleAccommodation');
    const headers = fixture.debugElement.queryAll(
      By.directive(TextInputComponent)
    );
    const accommodationHeader = headers.find(
      (h) => h.componentInstance.title() === 'Alojamiento'
    );

    if (!accommodationHeader) {
      fail('Expected Alojamiento header, but it was not found.');
      return;
    }
    expect(accommodationHeader).toBeTruthy('Expected Alojamiento header');

    const chevronButton = accommodationHeader.query(
      By.css('.c-text-input-nav-bar__chevron')
    );
    if (!chevronButton) {
      fail(
        'Expected chevron button in Alojamiento header, but it was not found.'
      );
      return;
    }
    expect(chevronButton).toBeTruthy(
      'Expected chevron button in Alojamiento header'
    );
    chevronButton.triggerEventHandler('click', null);
    expect(component.toggleAccommodation).toHaveBeenCalled();
  });

  it('should call togglePrice when price header is clicked', () => {
    fixture.detectChanges();
    spyOn(component, 'togglePrice');
    const headers = fixture.debugElement.queryAll(
      By.directive(TextInputComponent)
    );
    const priceHeader = headers.find(
      (h) => h.componentInstance.title() === 'Precio'
    );

    if (!priceHeader) {
      fail('Expected Precio header, but it was not found.');
      return;
    }
    expect(priceHeader).toBeTruthy('Expected Precio header');

    const chevronButton = priceHeader.query(
      By.css('.c-text-input-nav-bar__chevron')
    );
    if (!chevronButton) {
      fail('Expected chevron button in Precio header, but it was not found.');
      return;
    }
    expect(chevronButton).toBeTruthy(
      'Expected chevron button in Precio header'
    );
    chevronButton.triggerEventHandler('click', null);
    expect(component.togglePrice).toHaveBeenCalled();
  });

  describe('isGridVersion computed signal', () => {
    let parentElement: HTMLElement | null;

    beforeEach(() => {
      parentElement = fixture.nativeElement.parentElement;
      component.isXLScreen.set(false);
      fixture.detectChanges();
    });

    afterEach(() => {
      if (parentElement) {
        renderer.removeClass(parentElement, 'c-card-grid__filter--grid');
      }
    });

    it('should be true when parent has class and isXLScreen is true', () => {
      expect(parentElement).toBeTruthy(
        'Test requires a parent element for the host'
      );
      if (!parentElement) return;

      renderer.addClass(parentElement, 'c-card-grid__filter--grid');
      component.isXLScreen.set(true);
      fixture.detectChanges();

      expect(component.isGridVersion()).toBeTrue();
    });

    it('should be false when parent has class but isXLScreen is false', () => {
      expect(parentElement).toBeTruthy(
        'Test requires a parent element for the host'
      );
      if (!parentElement) return;

      renderer.addClass(parentElement, 'c-card-grid__filter--grid');
      component.isXLScreen.set(false);
      fixture.detectChanges();

      expect(component.isGridVersion()).toBeFalse();
    });

    it('should be false when parent does not have class even if isXLScreen is true', () => {
      expect(parentElement).toBeTruthy(
        'Test requires a parent element for the host'
      );
      if (!parentElement) return;

      renderer.removeClass(parentElement, 'c-card-grid__filter--grid');
      component.isXLScreen.set(true);
      fixture.detectChanges();

      expect(component.isGridVersion()).toBeFalse();
    });
  });

  describe('Media Query Listener', () => {
    it('should update isXLScreen when media query changes', () => {
      fixture.detectChanges();

      expect(
        mockMediaQueryList.addEventListener.calls.mostRecent().args[0]
      ).toBe('change');

      mediaQueryCallback({ matches: true });
      fixture.detectChanges();
      expect(component.isXLScreen()).toBeTrue();

      mediaQueryCallback({ matches: false });
      fixture.detectChanges();
      expect(component.isXLScreen()).toBeFalse();
    });
  });
});
