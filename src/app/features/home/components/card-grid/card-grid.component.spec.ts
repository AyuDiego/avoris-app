import { provideHttpClient, withFetch } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FilterService } from 'src/app/core/services/filter.service';
import { CARD_GROUPS } from 'src/app/mock-data/cards.mock';
import { CardGridComponent } from './card-grid.component';

describe('CardGridComponent', () => {
  let component: CardGridComponent;
  let fixture: ComponentFixture<CardGridComponent>;
  let filterService: FilterService;
  let mockMediaQueryList: {
    matches: boolean;
    addEventListener: jasmine.Spy;
    removeEventListener: jasmine.Spy;
  };
  let mediaQueryListeners: ((e: MediaQueryListEvent) => void)[] = [];

  beforeEach(async () => {
    mockMediaQueryList = {
      matches: false,
      addEventListener: jasmine
        .createSpy('addEventListener')
        .and.callFake(
          (type: string, listener: (e: MediaQueryListEvent) => void) => {
            if (type === 'change') mediaQueryListeners.push(listener);
          }
        ),
      removeEventListener: jasmine
        .createSpy('removeEventListener')
        .and.callFake(
          (type: string, listener: (e: MediaQueryListEvent) => void) => {
            if (type === 'change') {
              mediaQueryListeners = mediaQueryListeners.filter(
                (l) => l !== listener
              );
            }
          }
        ),
    };

    spyOn(window, 'matchMedia').and.returnValue(mockMediaQueryList as any);

    await TestBed.configureTestingModule({
      imports: [CardGridComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(withFetch()),
        FilterService,
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CardGridComponent);
    component = fixture.componentInstance;
    filterService = TestBed.inject(FilterService);
  });
  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    fixture.detectChanges();
    expect(component.isFilterOpen()).toBeFalse();
    expect(component.filterTriggerElement()).toBeFalsy();
    expect(component.allCardGroups()).toEqual(CARD_GROUPS);
    const initialServiceFilters = filterService.activeFilters();
    expect(initialServiceFilters.tags).toEqual([]);
    expect(initialServiceFilters.minPrice).toBeUndefined();
    expect(initialServiceFilters.maxPrice).toBeUndefined();
    expect(component.isXLScreen()).toBeFalse();
  });

  it('should toggle filter modal', () => {
    fixture.detectChanges();
    expect(component.isFilterOpen()).toBeFalse();
    component.toggleFilter();
    expect(component.isFilterOpen()).toBeTrue();
    component.toggleFilter();
    expect(component.isFilterOpen()).toBeFalse();
  });

  it('should close filter modal', () => {
    fixture.detectChanges();
    component.isFilterOpen.set(true);
    expect(component.isFilterOpen()).toBeTrue();
    component.closeFilterModal();
    expect(component.isFilterOpen()).toBeFalse();
  });

  it('should filter card groups based on criteria from service', () => {
    fixture.detectChanges();
    expect(component.filteredCardGroups().length).toEqual(
      component.allCardGroups().length
    );

    filterService.updateTag('Quads', true);
    fixture.detectChanges();

    expect(component.filteredCardGroups().length).toBeGreaterThan(0);
    const filteredGroups = component.filteredCardGroups();
    filteredGroups.forEach((group) => {
      group.cards.forEach((card) => {
        expect(card.tagText).toBe('Quads');
      });
    });
  });

  it('should filter cards by price range from service', () => {
    fixture.detectChanges();
    filterService.updateMinPrice('1000');
    filterService.updateMaxPrice('1500');
    fixture.detectChanges();

    const filteredGroups = component.filteredCardGroups();
    filteredGroups.forEach((group) => {
      group.cards.forEach((card) => {
        expect(card.price).toBeGreaterThanOrEqual(1000);
        expect(card.price).toBeLessThanOrEqual(1500);
      });
    });
  });
  it('should combine tag and price filters from service', () => {
    fixture.detectChanges();
    filterService.updateTag('Quads', true);
    filterService.updateMinPrice('1000');
    filterService.updateMaxPrice('1500');
    fixture.detectChanges();

    const filteredGroups = component.filteredCardGroups();
    filteredGroups.forEach((group) => {
      group.cards.forEach((card) => {
        expect(card.tagText).toBe('Quads');
        expect(card.price).toBeGreaterThanOrEqual(1000);
        expect(card.price).toBeLessThanOrEqual(1500);
      });
    });
  });
  it('should emit events when card buttons are clicked', () => {
    spyOn(component, 'onCardDetailsClicked');
    spyOn(component, 'onCardReserveClicked');
    fixture.detectChanges();
    const cardElements = fixture.debugElement.queryAll(By.css('app-card'));
    if (cardElements.length > 0) {
      const firstCard = cardElements[0].componentInstance;
      const cardData = component.filteredCardGroups()[0]?.cards[0];
      if (cardData) {
        firstCard.detailsClicked.emit();
        expect(component.onCardDetailsClicked).toHaveBeenCalledWith(
          cardData.title
        );
        firstCard.reserveClicked.emit();
        expect(component.onCardReserveClicked).toHaveBeenCalledWith(
          cardData.title
        );
      } else {
        fail('Could not find card data for the first card element.');
      }
    } else {
      console.warn('No app-card elements found to test button clicks.');
    }
  });

  it('should show title and subtitle', () => {
    fixture.detectChanges();
    const titleElement = fixture.debugElement.query(
      By.css('.c-card-grid__title')
    );
    expect(titleElement).toBeTruthy();
    const subtitleElement = fixture.debugElement.query(
      By.css('.c-card-grid__subtitle')
    );
    expect(subtitleElement).toBeTruthy();
    expect(subtitleElement.nativeElement.textContent).toContain(
      'Para los que les gusta explorar'
    );
  });

  it('should have filter button that toggles filter modal', () => {
    fixture.detectChanges();
    const filterButton = fixture.debugElement.query(
      By.css('.c-card-grid__action')
    );
    expect(filterButton).toBeTruthy();
    spyOn(component, 'toggleFilter').and.callThrough();
    filterButton.triggerEventHandler('click', null);
    expect(component.toggleFilter).toHaveBeenCalled();
    expect(component.isFilterOpen()).toBeTrue();
  });

  it('should call empty event handlers without error', () => {
    fixture.detectChanges();
    expect(() => component.onCardDetailsClicked('Test Title')).not.toThrow();
    expect(() => component.onCardReserveClicked('Test Title')).not.toThrow();
    expect(() => component.onClearSearch()).not.toThrow();
    expect(() => component.onSearchChange('test value')).not.toThrow();
  });

  it('should update isXLScreen signal based on media query matching', () => {
    mockMediaQueryList.matches = true;

    fixture = TestBed.createComponent(CardGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isXLScreen()).toBeTrue();

    mockMediaQueryList.matches = false;
    mediaQueryListeners.forEach((listener) => {
      listener({ matches: false } as MediaQueryListEvent);
    });

    fixture.detectChanges();
    expect(component.isXLScreen()).toBeFalse();
  });
});
