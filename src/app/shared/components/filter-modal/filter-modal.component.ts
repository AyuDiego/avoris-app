import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  Renderer2,
  inject,
  input,
  output,
  signal,
  computed,
  effect,
} from '@angular/core'; 
import { FilterCriteria } from '../../models/filter-criteria.model';
import { ALL_TAG_FILTERS, INITIAL_VISIBLE_COUNT, TagFilter } from 'src/app/mock-data/filters.mock';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { IconComponent } from '../icon/icon.component';
import { TextInputComponent } from '../text-input/text-input.component';

const BREAKPOINTS = {
  XL: 1440,
};

@Component({
    selector: 'app-filter-modal',
    imports: [
        CommonModule,
        IconComponent,
        TextInputComponent,
        CheckboxComponent,
    ],
    templateUrl: './filter-modal.component.html',
    styleUrls: ['./filter-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterModalComponent implements OnDestroy {
  readonly isOpen = input.required<boolean>();
  readonly closeModal = output<void>();
  readonly filtersChanged = output<FilterCriteria>();
  readonly isXLScreen = signal(false);
  readonly hideHeader = input(false);
  readonly isDestinationOpen = signal(false);
  readonly isAdventureOpen = signal(false);
  readonly isAccommodationOpen = signal(false);
  readonly isPriceOpen = signal(false);
  readonly minPrice = signal<string>('');
  readonly maxPrice = signal<string>('');
  readonly checkedTags = signal<Map<string, boolean>>(new Map());
  readonly showAllAdventureFilters = signal(false);
  readonly allAdventureFilters = signal<TagFilter[]>(ALL_TAG_FILTERS);

  readonly isGridVersion = computed(() => {
    const hostClasses = this.el.nativeElement.parentElement?.classList || [];
    return hostClasses.contains('c-card-grid__filter--grid') && this.isXLScreen();
  });

  readonly visibleAdventureFilters = computed<TagFilter[]>(() => {
    const all = this.allAdventureFilters();
    return this.showAllAdventureFilters() ? all : all.slice(0, INITIAL_VISIBLE_COUNT);
  });

  readonly hiddenAdventureFiltersCount = computed<number>(() => {
    return Math.max(0, this.allAdventureFilters().length - INITIAL_VISIBLE_COUNT);
  });

  readonly activeFilters = computed<FilterCriteria>(() => {
    const tags: string[] = [];
    this.checkedTags().forEach((isChecked, key) => {
      if (isChecked) tags.push(key);
    });

    const min = parseFloat(this.minPrice().replace(',', '.')) || undefined;
    const max = parseFloat(this.maxPrice().replace(',', '.')) || undefined;

    return { tags, minPrice: min, maxPrice: max };
  });

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  constructor() {
    const initialMap = new Map<string, boolean>();
    ALL_TAG_FILTERS.forEach((filter) => initialMap.set(filter.key, false));
    this.checkedTags.set(initialMap);

    if (typeof window !== 'undefined') {
      const xlMediaQuery = window.matchMedia(`(min-width: ${BREAKPOINTS.XL}px)`);
      this.isXLScreen.set(xlMediaQuery.matches);

      this.renderer.listen(xlMediaQuery, 'change', (event: MediaQueryListEvent) => {
        this.isXLScreen.set(event.matches);
      });
    }

    effect(() => {
      this.filtersChanged.emit(this.activeFilters());
    });

    effect(() => {
      const shouldBeOpen = this.isOpen();
      const hostElement = this.el.nativeElement;

      if (shouldBeOpen) {
        this.renderer.addClass(hostElement, 'is-open');
      } else {
        this.renderer.removeClass(hostElement, 'is-open');
      }
    });
  }

  ngOnDestroy(): void {}

  onClose(): void {
    this.closeModal.emit();
  }

  onApplyFilters(): void {
    this.onClose();
  }

  onClearFilters(): void {
    const clearedMap = new Map<string, boolean>();
    this.allAdventureFilters().forEach((filter) => clearedMap.set(filter.key, false));
    this.checkedTags.set(clearedMap);
    this.minPrice.set('');
    this.maxPrice.set('');
  }

  toggleDestination(): void {
    this.isDestinationOpen.update((open) => !open);
  }

  toggleAdventure(): void {
    this.isAdventureOpen.update((open) => !open);
  }

  toggleAccommodation(): void {
    this.isAccommodationOpen.update((open) => !open);
  }

  togglePrice(): void {
    this.isPriceOpen.update((open) => !open);
  }

  onTagCheckedChange(checked: boolean, filterKey: string): void {
    this.checkedTags.update((currentMap) => {
      const newMap = new Map(currentMap);
      newMap.set(filterKey, checked);
      return newMap;
    });
  }

  onMinPriceChange(value: string | null): void {
    if (value !== null) this.minPrice.set(value);
  }

  onMaxPriceChange(value: string): void {
    this.maxPrice.set(value);
  }

  toggleShowAllAdventureFilters(): void {
    this.showAllAdventureFilters.update((showing) => !showing);
  }
}
