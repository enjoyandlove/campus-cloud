import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { StoreService } from '../store.service';
import { CPSession } from '../../../../../../session';
import { CPI18nService } from '../../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-store-delete',
  templateUrl: './store-delete.component.html',
  styleUrls: ['./store-delete.component.scss']
})
export class StoreDeleteComponent implements OnInit {
  @Input() store;

  @Output() deleted: EventEmitter<number> = new EventEmitter();
  @Output() resetDeleteModal: EventEmitter<null> = new EventEmitter();

  buttonData;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: StoreService
  ) {}

  onDelete() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.service.deleteStore(this.store.id, search).subscribe(() => {
      this.deleted.emit(this.store.id);
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
