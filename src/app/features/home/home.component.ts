import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { CardGridComponent } from './components/card-grid/card-grid.component'; 

@Component({
    selector: 'app-home',
    imports: [CommonModule, HeroComponent, CardGridComponent],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {}
