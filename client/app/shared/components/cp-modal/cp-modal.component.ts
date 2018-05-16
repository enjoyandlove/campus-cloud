import { Component, Input, OnInit } from '@angular/core';

export const MODAL_TYPE = {
  DEFAULT: 'default',
  WIDE: 'wide'
};

type Position = 'center';

@Component({
  selector: 'cp-modal',
  templateUrl: './cp-modal.component.html',
  styleUrls: ['./cp-modal.component.scss']
})
export class CPModalComponent implements OnInit {
  @Input() modalId: string;
  @Input() type: string;
  @Input() position: Position;

  class;

  constructor() {}

  ngOnInit() {
    const type = this.type ? this.type : '';
    const position = this.position ? this.position : '';
    this.class = type + ' ' + position;
  }
}
