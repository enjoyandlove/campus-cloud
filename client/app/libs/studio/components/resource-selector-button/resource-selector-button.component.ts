import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-resource-selector-button',
  template: `
    <button [ngClass]="classes" (click)="onClick.emit()">
      <div class="wrapper">
        <img [src]="iconSrc"/>
        <ng-content></ng-content>
      </div>
    </button>
  `,
  styleUrls: ['./resource-selector-button.component.scss']
})
export class ResourceSelectorButtonComponent implements OnInit {
  @Input() active = false;
  @Input() iconSrc: string;
  @Input() id: number | string;

  @Output() onClick: EventEmitter<null> = new EventEmitter();

  get classes() {
    return {
      active: this.active
    };
  }

  ngOnInit() {}
}
