import { computed, Injectable, signal } from '@angular/core';
import { FilterCriteria } from '@avoris/avoris-ui/models';
import { CardData, CardGroup } from 'src/app/mock-data/cards.mock';
import { ALL_TAG_FILTERS, TagFilter } from 'src/app/mock-data/filters.mock';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  // Señales de Estado
  readonly minPrice = signal<string>('');
  readonly maxPrice = signal<string>('');
  readonly checkedTags = signal<Map<string, boolean>>(this.initializeTags());
  readonly allAdventureFilters = signal<TagFilter[]>(ALL_TAG_FILTERS);

  // Señal calculada para Filtros Activos
  readonly activeFilters = computed<FilterCriteria>(() => {
    const tags: string[] = [];
    this.checkedTags().forEach((isChecked, key) => {
      if (isChecked) tags.push(key);
    });

    const min = parseFloat(this.minPrice().replace(',', '.')) || undefined;
    const max = parseFloat(this.maxPrice().replace(',', '.')) || undefined;

    return { tags, minPrice: min, maxPrice: max };
  });

  // --- Métodos Públicos ---

  /**
   * Actualiza el estado de un filtro de etiqueta específico.
   */
  updateTag(filterKey: string, checked: boolean): void {
    this.checkedTags.update((currentMap) => {
      const newMap = new Map(currentMap);
      newMap.set(filterKey, checked);
      return newMap;
    });
  }

  /**
   * Actualiza el filtro de precio mínimo.
   */
  updateMinPrice(value: string | null): void {
    if (value !== null) this.minPrice.set(value);
  }

  /**
   * Actualiza el filtro de precio máximo.
   */
  updateMaxPrice(value: string): void {
    this.maxPrice.set(value);
  }

  /**
   * Restablece todos los filtros a su estado inicial.
   */
  clearFilters(): void {
    this.checkedTags.set(this.initializeTags());
    this.minPrice.set('');
    this.maxPrice.set('');
  }

  /**
   * Filtra grupos de tarjetas basado en los filtros activos actuales.
   */
  filterCardGroups(groups: CardGroup[]): CardGroup[] {
    const filters = this.activeFilters();
    const noTagsSelected = filters.tags.length === 0;
    const hasMinPrice =
      typeof filters.minPrice === 'number' && !isNaN(filters.minPrice);
    const hasMaxPrice =
      typeof filters.maxPrice === 'number' && !isNaN(filters.maxPrice);

    if (noTagsSelected && !hasMinPrice && !hasMaxPrice) {
      return groups; // No hay filtros aplicados, devuelve todos los grupos
    }

    return groups
      .map((group) => ({
        ...group,
        cards: group.cards.filter((card) =>
          this.cardMatchesFilters(card, filters)
        ),
      }))
      .filter((group) => group.cards.length > 0); // Elimina grupos sin tarjetas coincidentes
  }

  // --- Métodos Privados Auxiliares ---

  private initializeTags(): Map<string, boolean> {
    const initialMap = new Map<string, boolean>();
    ALL_TAG_FILTERS.forEach((filter) => initialMap.set(filter.key, false));
    return initialMap;
  }

  private cardMatchesFilters(card: CardData, filters: FilterCriteria): boolean {
    const noTagsSelected = filters.tags.length === 0;
    const hasMinPrice = typeof filters.minPrice === 'number';
    const hasMaxPrice = typeof filters.maxPrice === 'number';

    const matchesTag =
      noTagsSelected || (!!card.tagText && filters.tags.includes(card.tagText));

    const cardPrice = card.price;
    const matchesPrice =
      (!hasMinPrice || cardPrice >= filters.minPrice!) &&
      (!hasMaxPrice || cardPrice <= filters.maxPrice!);

    return matchesTag && matchesPrice;
  }
}
