import { TestBed } from '@angular/core/testing';
import { FilterService } from './filter.service';
import { ALL_TAG_FILTERS } from 'src/app/mock-data/filters.mock';
import { CardGroup } from 'src/app/mock-data/cards.mock';

describe('FilterService', () => {
  let service: FilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilterService]
    });
    service = TestBed.inject(FilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty filters', () => {
    expect(service.minPrice()).toBe('');
    expect(service.maxPrice()).toBe('');
    
    const tags = service.checkedTags();
    let anyTagChecked = false;
    
    tags.forEach((isChecked) => {
      if (isChecked) anyTagChecked = true;
    });
    
    expect(anyTagChecked).toBeFalse();
    expect(service.activeFilters().tags.length).toBe(0);
  });

  it('should update tags correctly', () => {
    const testTag = ALL_TAG_FILTERS[0].key;
    
    service.updateTag(testTag, true);
    expect(service.checkedTags().get(testTag)).toBeTrue();
    expect(service.activeFilters().tags).toContain(testTag);
    
    service.updateTag(testTag, false);
    expect(service.checkedTags().get(testTag)).toBeFalse();
    expect(service.activeFilters().tags).not.toContain(testTag);
  });

  it('should update price filters correctly', () => {
    service.updateMinPrice('100');
    service.updateMaxPrice('500');
    
    expect(service.minPrice()).toBe('100');
    expect(service.maxPrice()).toBe('500');
    
    expect(service.activeFilters().minPrice).toBe(100);
    expect(service.activeFilters().maxPrice).toBe(500);
  });

  it('should clear all filters when clearFilters is called', () => {
    const testTag = ALL_TAG_FILTERS[0].key;
    service.updateTag(testTag, true);
    service.updateMinPrice('100');
    service.updateMaxPrice('500');
    
    expect(service.checkedTags().get(testTag)).toBeTrue();
    expect(service.minPrice()).toBe('100');
    expect(service.maxPrice()).toBe('500');
    
    service.clearFilters();
    
    expect(service.minPrice()).toBe('');
    expect(service.maxPrice()).toBe('');
    
    const tags = service.checkedTags();
    let anyTagChecked = false;
    
    tags.forEach((isChecked) => {
      if (isChecked) anyTagChecked = true;
    });
    
    expect(anyTagChecked).toBeFalse();
    expect(service.activeFilters().tags.length).toBe(0);
  });
  it('should filter card groups based on tag criteria', () => {
    const mockCardGroups: CardGroup[] = [
      {
        groupTitle: 'Test Group',
        cards: [
          { 
            imageUrl: 'test1.jpg', 
            tagText: 'Quads', 
            location: 'Test Location', 
            duration: '7 días', 
            title: 'Test Title 1', 
            priceLabel: 'Desde', 
            price: 1000,
            detailsLabel: 'Ver desglose',
            reserveLabel: 'Reservar'
          },
          { 
            imageUrl: 'test2.jpg', 
            tagText: 'Rafting', 
            location: 'Test Location', 
            duration: '7 días', 
            title: 'Test Title 2', 
            priceLabel: 'Desde', 
            price: 2000,
            detailsLabel: 'Ver desglose',
            reserveLabel: 'Reservar'
          }
        ]
      }
    ];
    
    service.updateTag('Quads', true);
    const filtered = service.filterCardGroups(mockCardGroups);
    
    expect(filtered.length).toBe(1);
    expect(filtered[0].cards.length).toBe(1);
    expect(filtered[0].cards[0].tagText).toBe('Quads');
    
    service.clearFilters();
  });
  
});
