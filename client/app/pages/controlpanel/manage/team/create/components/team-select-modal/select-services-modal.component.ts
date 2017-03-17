import { Component, OnInit } from '@angular/core';

import { ServicesService } from '../../../../services/services.service';
import { BaseTeamSelectModalComponent } from './team-select-modal.component';

@Component({
  selector: 'cp-select-services-modal',
  templateUrl: './team-select-modal.component.html',
  styleUrls: ['./team-select-modal.component.scss']
})
export class SelectTeamServicesModalComponent extends BaseTeamSelectModalComponent
implements OnInit {

  constructor(private service: ServicesService) {
    super();
    this.title = 'Services';
  }

  ngOnInit() {
    super.fetch(this.service.getServices());
    super.buildPrivilegesDropDown();
  }
}
