import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import {
  ButtonsComponent,
  CardComponent,
  FilterModalComponent,
  TitleComponent,
} from '@avoris/avoris-ui';
import { FilterService } from 'src/app/core/services/filter.service';
import { CARD_GROUPS, CardGroup } from 'src/app/mock-data/cards.mock';

@Component({
  selector: 'app-card-grid',
  imports: [
    TitleComponent,
    ButtonsComponent,
    CardComponent,
    FilterModalComponent,
  ],
  templateUrl: './card-grid.component.html',
  styleUrl: './card-grid.component.scss',
})
export class CardGridComponent implements OnDestroy {
  readonly filterButtonRef =
    viewChild.required<ElementRef<HTMLElement>>('filterButton');

  readonly isFilterOpen = signal(false);
  readonly filterTriggerElement = signal<HTMLElement | null>(null);
  readonly allCardGroups = signal<CardGroup[]>(CARD_GROUPS);
  readonly isSidebarMode = signal(false);
  readonly isXLScreen = signal(false);

  private mediaQueryListener: (() => void) | null = null;
  private readonly filterService = inject(FilterService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly filteredCardGroups = computed<CardGroup[]>(() => {
    return this.filterService.filterCardGroups(this.allCardGroups());
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
    afterNextRender(() => {
      this.filterTriggerElement.set(this.filterButtonRef().nativeElement);
    });
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

  onCardDetailsClicked(cardTitle: string): void {}

  onCardReserveClicked(cardTitle: string): void {}

  onClearSearch(): void {}

  onSearchChange(value: string): void {}
}
