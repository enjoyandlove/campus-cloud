import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { CPI18nService } from '@shared/services/i18n.service';

@Component({
  selector: 'cp-delete-modal',
  templateUrl: './cp-delete-modal.component.html',
  styleUrls: ['./cp-delete-modal.component.scss']
})
export class CPDeleteModalComponent implements OnInit {
  @Input() modalBody: string;
  @Input() modalTitle: string;

  @Output() cancelClick: EventEmitter<null> = new EventEmitter();
  @Output() deleteClick: EventEmitter<null> = new EventEmitter();

  constructor(public cpI18n: CPI18nService) {}

  resetModal() {
    this.cancelClick.emit();
  }

  onDeleteClick() {
    this.deleteClick.emit();
  }

  ngOnInit() {}
}
