import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CardGridComponent } from './card-grid.component';
import { CARD_GROUPS } from 'src/app/mock-data/cards.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';

describe('CardGridComponent', () => {
  let component: CardGridComponent;
  let fixture: ComponentFixture<CardGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardGridComponent],
      providers: [provideHttpClient(withFetch())],
    }).compileComponents();

    fixture = TestBed.createComponent(CardGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isFilterOpen()).toBeFalse();
    expect(component.filterTriggerElement()).toBeNull();
    expect(component.allCardGroups()).toEqual(CARD_GROUPS);
    const filters = component.currentFilters();
    expect(filters.tags).toEqual([]);
    expect(filters.minPrice).toBeUndefined();
    expect(filters.maxPrice).toBeUndefined();
    expect(component.isXLScreen()).toBeFalse();
  });

  it('should toggle filter modal', () => {
    expect(component.isFilterOpen()).toBeFalse();
    component.toggleFilter();
    expect(component.isFilterOpen()).toBeTrue();
    component.toggleFilter();
    expect(component.isFilterOpen()).toBeFalse();
  });

  it('should close filter modal', () => {
    component.isFilterOpen.set(true);
    expect(component.isFilterOpen()).toBeTrue();
    component.closeFilterModal();
    expect(component.isFilterOpen()).toBeFalse();
  });

  it('should update filters', () => {
    const newFilters = {
      tags: ['Quads', 'Trekking'],
      minPrice: 100,
      maxPrice: 500,
    };
    component.updateFilters(newFilters);
    expect(component.currentFilters()).toEqual(newFilters);
  });

  it('should filter card groups based on criteria', () => {
    expect(component.filteredCardGroups().length).toEqual(
      component.allCardGroups().length
    );
    component.updateFilters({ tags: ['Quads'] });
    expect(component.filteredCardGroups().length).toBeGreaterThan(0);
    const filteredGroups = component.filteredCardGroups();
    filteredGroups.forEach((group) => {
      group.cards.forEach((card) => {
        expect(card.tagText).toBe('Quads');
      });
    });
  });

  it('should filter cards by price range', () => {
    component.updateFilters({ tags: [], minPrice: 1000, maxPrice: 1500 });
    const filteredGroups = component.filteredCardGroups();
    filteredGroups.forEach((group) => {
      group.cards.forEach((card) => {
        expect(card.price).toBeGreaterThanOrEqual(1000);
        expect(card.price).toBeLessThanOrEqual(1500);
      });
    });
  });

  it('should combine tag and price filters', () => {
    component.updateFilters({
      tags: ['Quads'],
      minPrice: 1000,
      maxPrice: 1500,
    });
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
      const cardTitle = component.allCardGroups()[0].cards[0].title;
      firstCard.detailsClicked.emit();
      expect(component.onCardDetailsClicked).toHaveBeenCalledWith(cardTitle);
      firstCard.reserveClicked.emit();
      expect(component.onCardReserveClicked).toHaveBeenCalledWith(cardTitle);
    }
  });

  it('should clean up media query listeners on component destruction', () => {
    const removeEventListenerSpy = jasmine.createSpy('removeEventListener');
    const mockMediaQueryList = {
      matches: false,
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: removeEventListenerSpy,
    } as any;
    spyOn(window, 'matchMedia').and.returnValue(mockMediaQueryList);
    const newFixture = TestBed.createComponent(CardGridComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();
    newComponent.ngOnDestroy();
    expect(removeEventListenerSpy).toHaveBeenCalled();
  });

  it('should show title and subtitle', () => {
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

  it('should have filter button with correct attributes', () => {
    const filterButton = fixture.debugElement.query(
      By.css('.c-card-grid__action')
    );
    expect(filterButton).toBeTruthy();
    filterButton.triggerEventHandler('click', null);
    expect(component.isFilterOpen()).toBeTrue();
  });
});
