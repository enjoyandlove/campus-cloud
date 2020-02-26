import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ready-ui-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {
  @Input()
  variant: 'stroked' | 'flat' = 'stroked';

  @Input()
  color: 'primary' | 'default' = 'default';

  @Output()
  close: EventEmitter<null> = new EventEmitter();

  get classess() {
    return {
      [`tag--color-${this.color}`]: true,
      [`tag--variant-${this.variant}`]: true
    };
  }

  constructor() {}

  ngOnInit() {}
}
