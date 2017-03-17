import { Component, OnInit } from '@angular/core';

import { ServicesService } from '../../../../services/services.service';
import { BaseTeamSelectModalComponent } from './team-select-modal.component';

@Component({
  selector: 'cp-select-clubs-modal',
  templateUrl: './team-select-modal.component.html',
  styleUrls: ['./team-select-modal.component.scss']
})
export class SelectTeamClubsModalComponent extends BaseTeamSelectModalComponent
implements OnInit {

  constructor(private service: ServicesService) {
    super();
    this.title = 'Clubs';
  }

  ngOnInit() {
    super.fetch(this.service.getServices());
  }
}
