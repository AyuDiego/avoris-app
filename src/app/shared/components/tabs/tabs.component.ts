import { Component, input, signal } from '@angular/core'; 
import { TABS, Tab } from 'src/app/mock-data/tabs.mock';
import { IconComponent } from '../icon/icon.component';

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
