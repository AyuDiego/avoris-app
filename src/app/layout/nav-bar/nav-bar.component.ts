import { Component, signal } from '@angular/core';
import { TabsComponent, ButtonsComponent, IconComponent } from '@avoris/avoris-ui'; 

import {TABS  } from 'src/app/mock-data/tabs.mock';
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [TabsComponent, ButtonsComponent, IconComponent],  

  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  TABS = TABS;
  isMobileMenuOpen = signal(false);  

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(isOpen => !isOpen);
  }

}
