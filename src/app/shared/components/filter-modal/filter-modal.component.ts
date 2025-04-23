import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Renderer2,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FilterService } from 'src/app/core/services/filter.service';
import {
  INITIAL_VISIBLE_COUNT,
  TagFilter,
} from 'src/app/mock-data/filters.mock';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { IconComponent } from '../icon/icon.component';
import { TextInputComponent } from '../text-input/text-input.component';

/**
 * Constantes de breakpoints para diseño responsive
 */
export const BREAKPOINTS = {
  XL: 1440, // Pantalla extra grande
};

/**
 * @component FilterModalComponent
 *
 * Implementación de modal de filtros con adaptación responsive para escritorio,
 * tablet y móvil. Utiliza la API de signals de Angular para una gestión reactiva del estado.
 *
 */
@Component({
  selector: 'app-filter-modal',
  imports: [CommonModule, IconComponent, TextInputComponent, CheckboxComponent],
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterModalComponent {
  // Servicios inyectados
  readonly filterService = inject(FilterService);
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  // Inputs y outputs
  readonly isOpen = input.required<boolean>(); // Control de visibilidad del modal
  readonly hideHeader = input(false); // Opción para ocultar el boton de cerrar de la cabecera
  readonly closeModal = output<void>(); // Evento al cerrar el modal

  // Signals de estado
  readonly isXLScreen = signal(false); // Detección de pantalla grande
  readonly isDestinationOpen = signal(false);
  readonly isAdventureOpen = signal(false);
  readonly isAccommodationOpen = signal(false);
  readonly isPriceOpen = signal(false);
  readonly showAllAdventureFilters = signal(false);

  // Signals computadas
  readonly isGridVersion = computed(() => {
    const hostClasses = this.el.nativeElement.parentElement?.classList || [];
    return (
      hostClasses.contains('c-card-grid__filter--grid') && this.isXLScreen()
    );
  });

  readonly visibleAdventureFilters = computed<TagFilter[]>(() => {
    const all = this.filterService.allAdventureFilters();
    return this.showAllAdventureFilters()
      ? all
      : all.slice(0, INITIAL_VISIBLE_COUNT);
  });

  readonly hiddenAdventureFiltersCount = computed<number>(() => {
    return Math.max(
      0,
      this.filterService.allAdventureFilters().length - INITIAL_VISIBLE_COUNT
    );
  });

  constructor() {
    // Configuración responsive mediante MediaQuery
    if (typeof window !== 'undefined') {
      const xlMediaQuery = window.matchMedia(
        `(min-width: ${BREAKPOINTS.XL}px)`
      );
      this.isXLScreen.set(xlMediaQuery.matches);
      this.renderer.listen(
        xlMediaQuery,
        'change',
        (event: MediaQueryListEvent) => {
          this.isXLScreen.set(event.matches);
        }
      );
    }

    // Effect para manejar las clases CSS según el estado de apertura
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

  // Métodos de acción del modal
  onClose(): void {
    this.closeModal.emit();
  }

  onApplyFilters(): void {
    this.onClose();
  }

  onClearFilters(): void {
    this.filterService.clearFilters();
  }

  // Métodos toggle para secciones de filtros
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

  toggleShowAllAdventureFilters(): void {
    this.showAllAdventureFilters.update((showing) => !showing);
  }
}
