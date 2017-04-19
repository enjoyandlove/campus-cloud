import { Component, OnInit, Input } from '@angular/core';

export const MODAL_TYPE = {
  'DEFAULT': 'default',
  'WIDE': 'wide'
};

@Component({
  selector: 'cp-modal',
  templateUrl: './cp-modal.component.html',
  styleUrls: ['./cp-modal.component.scss']
})
export class CPModalComponent implements OnInit {
  @Input() modalId: string;
  @Input() type: string;

  constructor() { }

  ngOnInit() {
    this.type = this.type ? this.type : '';
  }
}
