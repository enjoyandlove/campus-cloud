import { Component, OnInit } from '@angular/core';

import { ClubsService } from '../../../../clubs/clubs.service';
import { BaseTeamSelectModalComponent } from './team-select-modal.component';

@Component({
  selector: 'cp-select-clubs-modal',
  templateUrl: './team-select-modal.component.html',
  styleUrls: ['./team-select-modal.component.scss']
})
export class SelectTeamClubsModalComponent extends BaseTeamSelectModalComponent
implements OnInit {

  constructor(private service: ClubsService) {
    super();
    this.title = 'Clubs';
  }

  ngOnInit() {
    super.fetch(this.service.getClubs());
    super.buildPrivilegesDropDown();
  }
}
