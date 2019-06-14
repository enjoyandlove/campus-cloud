import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { CPSession } from '@campus-cloud/session';
import { CPI18nService } from '@campus-cloud/shared/services';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { AdminService, CPTrackingService } from '@campus-cloud/shared/services';

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
    public session: CPSession,
    public cpI18n: CPI18nService,
    public adminService: AdminService,
    public cpTracking: CPTrackingService
  ) {}

  onDelete() {
    const eventProperties = {
      user_status: this.admin.account_activated ? amplitudeEvents.ACTIVE : amplitudeEvents.PENDING
    };

    const search = new HttpParams().append('school_ids', this.session.g.get('school').id);

    this.adminService.deleteAdminById(this.admin.id, search).subscribe(
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
