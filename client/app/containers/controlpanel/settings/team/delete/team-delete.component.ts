import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { AdminService, CPTrackingService } from '../../../../../shared/services';
import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';

declare var $: any;

@Component({
  selector: 'cp-team-delete',
  templateUrl: './team-delete.component.html',
  styleUrls: ['./team-delete.component.scss']
})
export class TeamDeleteComponent implements OnInit {
  @Input() admin: any;
  @Output() deleted: EventEmitter<any> = new EventEmitter();
  @Output() unauthorized: EventEmitter<null> = new EventEmitter();

  buttonData;

  constructor(
    public cpI18n: CPI18nService,
    public adminService: AdminService,
    public cpTracking: CPTrackingService) {}

  onDelete() {
    const eventProperties = {
      user_status: this.admin.account_activated ? amplitudeEvents.ACTIVE : amplitudeEvents.PENDING
    };

    this.adminService.deleteAdminById(this.admin.id).subscribe(
      () => {
        this.cpTracking.amplitudeEmitEvent(amplitudeEvents.DELETED_TEAM_MEMBER, eventProperties);
        this.deleted.emit(this.admin.id);
        $('#teamDeleteModal').modal('hide');
        this.buttonData = Object.assign({}, this.buttonData, {
          disabled: false
        });
      },
      (err) => {
        $('#teamDeleteModal').modal('hide');
        this.buttonData = Object.assign({}, this.buttonData, {
          disabled: false
        });

        if (err.status === 403) {
          this.unauthorized.emit();
        }
      }
    );
  }
  ngOnInit() {
    this.buttonData = {
      class: 'danger',
      text: this.cpI18n.translate('delete')
    };
  }
}
