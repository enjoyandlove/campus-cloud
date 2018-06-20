import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { IDeal } from '../deals.interface';
import { DealsService } from '../deals.service';
import { CPSession } from './../../../../../session';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-deals-delete',
  templateUrl: './deals-delete.component.html',
  styleUrls: ['./deals-delete.component.scss']
})
export class DealsDeleteComponent implements OnInit {
  @Input() deal: IDeal;

  @Output() deleted: EventEmitter<number> = new EventEmitter();
  @Output() resetDeleteModal: EventEmitter<null> = new EventEmitter();

  buttonData;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: DealsService
  ) {}

  onDelete() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.service.deleteDeal(this.deal.id, search).subscribe(() => {
      this.deleted.emit(this.deal.id);
      this.resetDeleteModal.emit();
      $('#deleteModal').modal('hide');
    });
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('delete'),
      class: 'danger'
    };
  }
}
