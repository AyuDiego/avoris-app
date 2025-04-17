import { Component, input } from '@angular/core';

export type TagVariant = 'secondary' | 'grey';

@Component({
    selector: 'app-tag',
    imports: [],
    templateUrl: './tag.component.html',
    styleUrl: './tag.component.scss'
})
export class TagComponent {
  readonly variant = input<TagVariant>('secondary');
  readonly label = input<string>('Tag');
}
