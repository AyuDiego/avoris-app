import {
  Component,
  ElementRef,
  ViewChild,
  computed,
  signal,
  inject,
  PLATFORM_ID,
  OnDestroy,
} from '@angular/core';
import {
  ButtonsComponent,
  CardComponent,
  FilterModalComponent,
  TitleComponent,
} from '@avoris/avoris-ui';
import { CARD_GROUPS, CardGroup } from 'src/app/mock-data/cards.mock';
import { FilterCriteria } from '@avoris/avoris-ui/models';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-card-grid',
    imports: [
        TitleComponent,
        ButtonsComponent,
        CardComponent,
        FilterModalComponent,
    ],
    templateUrl: './card-grid.component.html',
    styleUrl: './card-grid.component.scss'
})
export class CardGridComponent implements OnDestroy {
  @ViewChild('filterButton', { read: ElementRef }) filterButtonRef:
    | ElementRef<HTMLElement>
    | undefined;

  readonly isFilterOpen = signal(false);
  readonly filterTriggerElement = signal<HTMLElement | null>(null);
  readonly allCardGroups = signal<CardGroup[]>(CARD_GROUPS);
  readonly currentFilters = signal<FilterCriteria>({ tags: [] });
  readonly isSidebarMode = signal(false);
  readonly isXLScreen = signal(false);

  private readonly platformId = inject(PLATFORM_ID);
  private mediaQueryListener: (() => void) | null = null;

  readonly filteredCardGroups = computed<CardGroup[]>(() => {
    const groups = this.allCardGroups();
    const filters = this.currentFilters();
    const noTagsSelected = filters.tags.length === 0;
    const hasMinPrice =
      typeof filters.minPrice === 'number' && !isNaN(filters.minPrice);
    const hasMaxPrice =
      typeof filters.maxPrice === 'number' && !isNaN(filters.maxPrice);

    if (noTagsSelected && !hasMinPrice && !hasMaxPrice) {
      return groups;
    }

    return groups
      .map((group) => ({
        ...group,
        cards: group.cards.filter((card) => {
          const matchesTag =
            noTagsSelected ||
            (card.tagText && filters.tags.includes(card.tagText));
          const cardPrice = card.price;
          const matchesPrice =
            (!hasMinPrice || cardPrice >= filters.minPrice!) &&
            (!hasMaxPrice || cardPrice <= filters.maxPrice!);
          return matchesTag && matchesPrice;
        }),
      }))
      .filter((group) => group.cards.length > 0);
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const xlMediaQuery = window.matchMedia('(min-width: 1440px)');
      this.isXLScreen.set(xlMediaQuery.matches);

      const mediaHandler = (e: MediaQueryListEvent) => {
        this.isXLScreen.set(e.matches);
      };
      xlMediaQuery.addEventListener('change', mediaHandler);
      this.mediaQueryListener = () =>
        xlMediaQuery.removeEventListener('change', mediaHandler);
    }
    if (this.filterButtonRef) {
      this.filterTriggerElement.set(this.filterButtonRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    if (this.mediaQueryListener) {
      this.mediaQueryListener();
    }
  }

  toggleFilter(): void {
    this.isFilterOpen.update((open) => !open);
  }

  closeFilterModal(): void {
    this.isFilterOpen.set(false);
  }

  updateFilters(newFilters: FilterCriteria): void {
    this.currentFilters.set(newFilters);
  }

  onCardDetailsClicked(cardTitle: string): void {}

  onCardReserveClicked(cardTitle: string): void {}

  onClearSearch(): void {}

  onSearchChange(value: string): void {}
}
