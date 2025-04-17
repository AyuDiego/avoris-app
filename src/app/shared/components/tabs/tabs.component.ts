import { Component, input, signal } from '@angular/core';
import { IconComponent } from '@avoris/avoris-ui';
import { TABS, Tab } from 'src/app/mock-data/tabs.mock';

@Component({
    selector: 'app-tabs',
    imports: [IconComponent],
    templateUrl: './tabs.component.html',
    styleUrl: './tabs.component.scss'
})
export class TabsComponent {
  readonly tabs = input<Tab[]>(TABS);
  activeIndex = signal(0);

  setActive(index: number) {
    this.activeIndex.set(index);
  }
}
