import { Component, Input } from '@angular/core';

@Component({
  selector: 'cp-resource-selector-item',
  template: `
    <div *ngIf="active">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./resource-selector-item.component.scss']
})
export class ResourceSelectorItemComponent {
  @Input() title: string;
  @Input() iconSrc: string;
  @Input() active = false;
  @Input() resourceId: string;
}
