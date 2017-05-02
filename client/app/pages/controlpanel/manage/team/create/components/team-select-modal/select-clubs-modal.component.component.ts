import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { ClubsService } from '../../../../clubs/clubs.service';
import { CP_PRIVILEGES_MAP } from '../../../../../../../shared/utils';
import { BaseTeamSelectModalComponent } from './team-select-modal.component';

declare var $: any;

@Component({
  selector: 'cp-select-clubs-modal',
  templateUrl: './team-select-modal.component.html',
  styleUrls: ['./team-select-modal.component.scss']
})
export class SelectTeamClubsModalComponent extends BaseTeamSelectModalComponent
  implements OnInit {
  @Output() selected: EventEmitter<any> = new EventEmitter();

  constructor(
    private service: ClubsService
  ) {
    super();
    this.title = 'Clubs';
    this.privilegeType = CP_PRIVILEGES_MAP.clubs;
  }

  onSubmit(): any {
    this.selected.emit(super.onSubmit());
    $('#selectClubsModal').modal('hide');
  }

  ngOnInit() {
    super.fetch(this.service.getClubs());
    super.buildPrivilegesDropDown();
  }
}
