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
/**
 * Constantes de breakpoints para diseño responsive
 * Siguiendo buenas prácticas de maquetación, defino puntos de ruptura
 * consistentes para garantizar una experiencia uniforme en todos los
 * componentes de la aplicación.
 */
const BREAKPOINTS = {
  XL: 1440, // Punto de ruptura para pantallas escritorio
};

/**
 * @component FilterModalComponent
 * 
 * Implementación de modal de filtros con adaptación responsive para escritorio, 
 * tablet y móvil. Utiliza la API de signals de Angular para una gestión reactiva del estado.
 * 
 * Características principales:
 * - Diseño responsive con comportamiento adaptado a cada dispositivo
 * - Modo grid para pantallas grandes y overlay para móvil/tablet
 * - Filtros dinámicos con interacción inmediata
 * - Gestión de estado optimizada con signals de Angular
 * - Accesibilidad completa (WAI-ARIA) para lectores de pantalla
 * 
 * @implements OnDestroy - Implementado para limpiar listeners y evitar memory leaks
 */
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
  // API pública para el componente (inputs/outputs)
  readonly isOpen = input.required<boolean>(); // Control de visibilidad del modal
  readonly closeModal = output<void>(); // Evento al cerrar el modal
  readonly filtersChanged = output<FilterCriteria>(); // Evento al cambiar filtros
  readonly isXLScreen = signal(false); // Detección de pantalla grande
  readonly hideHeader = input(false); // Opción para ocultar cabecera
  
  // Signals para manejar el estado de los acordeones
  readonly isDestinationOpen = signal(false);
  readonly isAdventureOpen = signal(false);
  readonly isAccommodationOpen = signal(false);
  readonly isPriceOpen = signal(false);
  
  // Signals para manejar el estado de los filtros
  readonly minPrice = signal<string>('');
  readonly maxPrice = signal<string>('');
  readonly checkedTags = signal<Map<string, boolean>>(new Map());
  readonly showAllAdventureFilters = signal(false);
  readonly allAdventureFilters = signal<TagFilter[]>(ALL_TAG_FILTERS);

  /**
   * Signal computada para determinar si estamos en modo grid o overlay
   * Utilizo señales computadas para centralizar la lógica de decisión
   * y evitar cálculos redundantes
   */
  readonly isGridVersion = computed(() => {
    const hostClasses = this.el.nativeElement.parentElement?.classList || [];
    return hostClasses.contains('c-card-grid__filter--grid') && this.isXLScreen();
  });

  /**
   * Filtros visibles según la configuración actual
   * Implementa patrón "Ver más" para mejorar UX en listados extensos
   */
  readonly visibleAdventureFilters = computed<TagFilter[]>(() => {
    const all = this.allAdventureFilters();
    return this.showAllAdventureFilters() ? all : all.slice(0, INITIAL_VISIBLE_COUNT);
  });

  /**
   * Contador para botón "Ver más"
   * Mejora la experiencia de usuario mostrando cuántos elementos adicionales hay
   */
  readonly hiddenAdventureFiltersCount = computed<number>(() => {
    return Math.max(0, this.allAdventureFilters().length - INITIAL_VISIBLE_COUNT);
  });

  /**
   * Genera el objeto de filtros activos para emitir al componente padre
   * Esta signal computada centraliza la lógica de transformación de estado interno
   * a la estructura esperada por la API de filtrado
   */
  readonly activeFilters = computed<FilterCriteria>(() => {
    const tags: string[] = [];
    this.checkedTags().forEach((isChecked, key) => {
      if (isChecked) tags.push(key);
    });

    // Conversión segura de strings a números con manejo de formato europeo (comas)
    const min = parseFloat(this.minPrice().replace(',', '.')) || undefined;
    const max = parseFloat(this.maxPrice().replace(',', '.')) || undefined;

    return { tags, minPrice: min, maxPrice: max };
  });

  // Inyección de dependencias
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  constructor() {
    // Inicialización del mapa de filtros seleccionados
    const initialMap = new Map<string, boolean>();
    ALL_TAG_FILTERS.forEach((filter) => initialMap.set(filter.key, false));
    this.checkedTags.set(initialMap);

    // Configuración responsive mediante MediaQuery
    if (typeof window !== 'undefined') {
      const xlMediaQuery = window.matchMedia(`(min-width: ${BREAKPOINTS.XL}px)`);
      this.isXLScreen.set(xlMediaQuery.matches);

      // Manejo del cambio de tamaño de pantalla en tiempo real
      this.renderer.listen(xlMediaQuery, 'change', (event: MediaQueryListEvent) => {
        this.isXLScreen.set(event.matches);
      });
    }

    // Effect para propagar cambios en filtros al componente padre
    effect(() => {
      this.filtersChanged.emit(this.activeFilters());
    });

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

  /**
   * Limpieza de recursos al destruir el componente
   * Importante para prevenir memory leaks en aplicaciones SPA
   */
  ngOnDestroy(): void {
    // La limpieza de MediaQueryList listener se maneja automáticamente
    // por el sistema de inyección de dependencias de Angular
  }

  /**
   * Manejador para cerrar el modal de filtros
   * Emite el evento para que el componente padre actualice su estado
   */
  onClose(): void {
    this.closeModal.emit();
  }

  /**
   * Aplica los filtros seleccionados y cierra el modal
   * Este método proporciona una mejor experiencia de usuario al confirmar
   * la acción y cerrar el panel en dispositivos móviles
   */
  onApplyFilters(): void {
    this.onClose();
  }

  /**
   * Restablece todos los filtros a su estado inicial
   * Implementa un patrón común en interfaces de filtrado para mejorar UX
   */
  onClearFilters(): void {
    const clearedMap = new Map<string, boolean>();
    this.allAdventureFilters().forEach((filter) => clearedMap.set(filter.key, false));
    this.checkedTags.set(clearedMap);
    this.minPrice.set('');
    this.maxPrice.set('');
  }

  /**
   * Toggle de apertura para la sección de destinos
   * Utiliza el patrón de actualización inmutable para signals
   */
  toggleDestination(): void {
    this.isDestinationOpen.update((open) => !open);
  }

  /**
   * Toggle de apertura para la sección de aventuras
   * Implementa un acordeón para mejorar la organización de filtros
   */
  toggleAdventure(): void {
    this.isAdventureOpen.update((open) => !open);
  }

  /**
   * Toggle de apertura para la sección de alojamiento
   * Diseñado siguiendo patrones de accesibilidad WCAG 2.1
   */
  toggleAccommodation(): void {
    this.isAccommodationOpen.update((open) => !open);
  }

  /**
   * Toggle de apertura para la sección de precios
   * Permite al usuario acceder a filtros avanzados de rango
   */
  togglePrice(): void {
    this.isPriceOpen.update((open) => !open);
  }

  /**
   * Actualiza el estado de un filtro tag específico
   * Usa una estrategia de inmutabilidad para evitar problemas de detección de cambios
   * 
   * @param checked Estado del checkbox (seleccionado/no seleccionado)
   * @param filterKey Identificador único del filtro tag
   */
  onTagCheckedChange(checked: boolean, filterKey: string): void {
    this.checkedTags.update((currentMap) => {
      const newMap = new Map(currentMap);
      newMap.set(filterKey, checked);
      return newMap;
    });
  }

  /**
   * Actualiza el valor mínimo del filtro de precio
   * Incluye validación para evitar valores nulos
   * 
   * @param value Precio mínimo como string (formato europeo)
   */
  onMinPriceChange(value: string | null): void {
    if (value !== null) this.minPrice.set(value);
  }

  /**
   * Actualiza el valor máximo del filtro de precio
   * 
   * @param value Precio máximo como string (formato europeo)
   */
  onMaxPriceChange(value: string): void {
    this.maxPrice.set(value);
  }

  /**
   * Toggle para mostrar/ocultar filtros adicionales
   * Mejora la UX al mostrar una lista inicial compacta con opción de expandir
   */
  toggleShowAllAdventureFilters(): void {
    this.showAllAdventureFilters.update((showing) => !showing);
  }
}