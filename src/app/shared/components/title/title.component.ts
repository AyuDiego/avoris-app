import { Component, input } from '@angular/core';

@Component({
    selector: 'app-title',
    imports: [],
    templateUrl: './title.component.html',
    styleUrl: './title.component.scss'
})
export class TitleComponent {
  readonly text = input<string>('Título'); 
  readonly customClass = input<string>(''); 


}
