import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { CP_PRIVILEGES_MAP } from '../../../../../../../shared/utils';
import { ServicesService } from '../../../../services/services.service';
import { BaseTeamSelectModalComponent } from './team-select-modal.component';

declare var $: any;

@Component({
  selector: 'cp-select-services-modal',
  templateUrl: './team-select-modal.component.html',
  styleUrls: ['./team-select-modal.component.scss']
})
export class SelectTeamServicesModalComponent extends BaseTeamSelectModalComponent
implements OnInit {
  @Output() selected: EventEmitter<any> = new EventEmitter();

  constructor(private service: ServicesService) {
    super();
    this.title = 'Services';
    this.privilegeType = CP_PRIVILEGES_MAP.services;
  }

  onSubmit(): any {
    this.selected.emit(super.onSubmit());
    $('#selectServicesModal').modal('hide');
  }

  ngOnInit() {
    super.fetch(this.service.getServices(1, 1000));
    super.buildPrivilegesDropDown();
  }
}
