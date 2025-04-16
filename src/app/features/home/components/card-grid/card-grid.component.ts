import { Component, signal } from '@angular/core';
import {
  ButtonsComponent,
  CardComponent,
  CheckboxComponent,
  TagComponent,
  TextInputComponent,
  TitleComponent,
} from '@avoris/avoris-ui';
import { CARD_GROUPS, CardGroup } from 'src/app/mock-data/cards.mock';

@Component({
  selector: 'app-card-grid',
  standalone: true,
  imports: [
    TagComponent,
    TitleComponent,
    TextInputComponent,
    CheckboxComponent,
    ButtonsComponent,
    CardComponent,
  ],
  templateUrl: './card-grid.component.html',
  styleUrl: './card-grid.component.scss',
})
export class CardGridComponent {
  isOpen = false;
  inputValue = '';
  cardGroups = signal<CardGroup[]>(CARD_GROUPS);

  onCardDetailsClicked(cardTitle: string): void {
    console.log(`Details clicked for: ${cardTitle}`);
  }

  onCardReserveClicked(cardTitle: string): void {
    console.log(`Reserve clicked for: ${cardTitle}`);
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }
  onClearSearch(): void {
    console.log('Search cleared');
  }
  onSearchChange(value: string): void {
    console.log('Search changed:', value);
  }
}
