import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-resource-selector-button',
  template: `
    <button [cpTarget]="id" [ngClass]="classes" (click)="clicked.emit()" [attr.aria-label]="id">
      <img [src]="iconSrc" alt="" aria-hidden="true" />
      <span><ng-content></ng-content></span>
    </button>
  `,
  styleUrls: ['./resource-selector-button.component.scss']
})
export class ResourceSelectorButtonComponent implements OnInit {
  @Input() active = false;
  @Input() iconSrc: string;
  @Input() id: number | string;

  @Output() clicked: EventEmitter<null> = new EventEmitter();

  get classes() {
    return {
      active: this.active
    };
  }

  ngOnInit() {}
}
