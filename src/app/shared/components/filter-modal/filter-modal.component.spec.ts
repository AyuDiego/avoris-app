import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FilterModalComponent } from './filter-modal.component';
import { ALL_TAG_FILTERS, INITIAL_VISIBLE_COUNT } from 'src/app/mock-data/filters.mock';
import { FilterCriteria } from '../../models/filter-criteria.model';
import { provideHttpClient, withFetch } from '@angular/common/http';

describe('FilterModalComponent', () => {
  let component: FilterModalComponent;
  let fixture: ComponentFixture<FilterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterModalComponent],
      providers: [
        provideHttpClient(withFetch()), 
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilterModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show/hide header based on hideHeader input', () => {
    expect(component.hideHeader()).toBeFalse();
    expect(fixture.debugElement.query(By.css('.c-filter-modal__close-btn'))).toBeTruthy();
    fixture.componentRef.setInput('hideHeader', true);
    fixture.detectChanges();
    expect(component.hideHeader()).toBeTrue();
    expect(fixture.debugElement.query(By.css('.c-filter-modal__close-btn'))).toBeNull();
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
    expect(component.visibleAdventureFilters().length).toBe(INITIAL_VISIBLE_COUNT);
  });

  it('should show all adventure filters when showAllAdventureFilters is true', () => {
    component.showAllAdventureFilters.set(true);
    expect(component.visibleAdventureFilters().length).toBe(ALL_TAG_FILTERS.length);
  });

  it('should calculate correct hidden filters count', () => {
    component.showAllAdventureFilters.set(false);
    const expectedHiddenCount = ALL_TAG_FILTERS.length - INITIAL_VISIBLE_COUNT;
    expect(component.hiddenAdventureFiltersCount()).toBe(expectedHiddenCount);
  });

  it('should toggle showAllAdventureFilters', () => {
    expect(component.showAllAdventureFilters()).toBeFalse();
    component.toggleShowAllAdventureFilters();
    expect(component.showAllAdventureFilters()).toBeTrue();
    component.toggleShowAllAdventureFilters();
    expect(component.showAllAdventureFilters()).toBeFalse();
  });

  it('should update tag selection with onTagCheckedChange', () => {
    const testFilterKey = ALL_TAG_FILTERS[0].key;
    expect(component.checkedTags().get(testFilterKey)).toBeFalse();
    component.onTagCheckedChange(true, testFilterKey);
    expect(component.checkedTags().get(testFilterKey)).toBeTrue();
    component.onTagCheckedChange(false, testFilterKey);
    expect(component.checkedTags().get(testFilterKey)).toBeFalse();
  });

  it('should update minPrice with onMinPriceChange', () => {
    expect(component.minPrice()).toBe('');
    component.onMinPriceChange('100');
    expect(component.minPrice()).toBe('100');
  });

  it('should update maxPrice with onMaxPriceChange', () => {
    expect(component.maxPrice()).toBe('');
    component.onMaxPriceChange('500');
    expect(component.maxPrice()).toBe('500');
  });

  it('should emit closeModal when onClose is called', () => {
    spyOn(component.closeModal, 'emit');
    component.onClose();
    expect(component.closeModal.emit).toHaveBeenCalled();
  });

  it('should call onClose when onApplyFilters is called', () => {
    spyOn(component, 'onClose');
    component.onApplyFilters();
    expect(component.onClose).toHaveBeenCalled();
  });

  it('should reset all filters when onClearFilters is called', () => {
    component.onTagCheckedChange(true, ALL_TAG_FILTERS[0].key);
    component.onMinPriceChange('100');
    component.onMaxPriceChange('500');
    expect(component.checkedTags().get(ALL_TAG_FILTERS[0].key)).toBeTrue();
    expect(component.minPrice()).toBe('100');
    expect(component.maxPrice()).toBe('500');
    component.onClearFilters();
    expect(component.checkedTags().get(ALL_TAG_FILTERS[0].key)).toBeFalse();
    expect(component.minPrice()).toBe('');
    expect(component.maxPrice()).toBe('');
  });

  it('should generate correct activeFilters', () => {
    const testTag = ALL_TAG_FILTERS[0].key;
    component.onTagCheckedChange(true, testTag);
    component.onMinPriceChange('100');
    component.onMaxPriceChange('500');
    const filters = component.activeFilters();
    expect(filters.tags).toContain(testTag);
    expect(filters.minPrice).toBe(100);
    expect(filters.maxPrice).toBe(500);
  });

  it('should emit filtersChanged with activeFilters', () => {
    spyOn(component.filtersChanged, 'emit');
    component.onTagCheckedChange(true, ALL_TAG_FILTERS[0].key);
    component.onMinPriceChange('100');
    component.onMaxPriceChange('500');
    fixture.detectChanges();
    expect(component.filtersChanged.emit).toHaveBeenCalled();
    const lastCall = (component.filtersChanged.emit as jasmine.Spy).calls.mostRecent();
    const emittedFilters: FilterCriteria = lastCall.args[0];
    expect(emittedFilters.tags.length).toBe(1);
    expect(emittedFilters.tags[0]).toBe(ALL_TAG_FILTERS[0].key);
    expect(emittedFilters.minPrice).toBe(100);
    expect(emittedFilters.maxPrice).toBe(500);
  });

  it('should handle empty or invalid price inputs', () => {
    component.onMinPriceChange('');
    component.onMaxPriceChange('invalid');
    const filters = component.activeFilters();
    expect(filters.minPrice).toBeUndefined(); 
    expect(filters.maxPrice).toBeUndefined();  
  });
});
