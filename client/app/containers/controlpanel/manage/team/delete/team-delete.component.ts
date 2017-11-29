import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { AdminService } from '../../../../../shared/services';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

declare var $: any;

@Component({
  selector: 'cp-team-delete',
  templateUrl: './team-delete.component.html',
  styleUrls: ['./team-delete.component.scss']
})
export class TeamDeleteComponent implements OnInit {
  @Input() admin: any;
  @Output() deleted: EventEmitter<any> = new EventEmitter();
  @Output() errorModal: EventEmitter<null> = new EventEmitter();
  @Output() unauthorized: EventEmitter<null> = new EventEmitter();

  buttonData;

  constructor(
    public cpI18n: CPI18nService,
    public adminService: AdminService
  ) { }

  onDelete() {
    this
      .adminService
      .deleteAdminById(this.admin.id)
      .subscribe(
        res => {
          console.log('DELETE RES CB', res);
          this.deleted.emit(this.admin.id);
          $('#teamDeleteModal').modal('hide');
          this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
        },
        err => {
          console.log('DELETE CB ERROR', err);
          this.buttonData = Object.assign({}, this.buttonData, { disabled: false });

          if (err.status === 503) {
            this.errorModal.emit();
          }

          if (err.status === 403) {
            this.unauthorized.emit();
          }

          $('#teamDeleteModal').modal('hide');
        }
      );

  }
  ngOnInit() {
    this.buttonData = {
      class: 'danger',
      text: this.cpI18n.translate('delete')
    }
  }
}

