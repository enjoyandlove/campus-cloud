import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ClubsService } from '../../../../../clubs/clubs.service';
import { CP_PRIVILEGES_MAP } from '../../../../../../../../shared/utils';
import { BaseTeamSelectModalComponent } from '../base/team-select-modal.component';

@Component({
  selector: 'cp-select-clubs-modal',
  templateUrl: './select-clubs-modal.component.html'
})
export class SelectTeamClubsModalComponent extends BaseTeamSelectModalComponent
  implements OnInit {
  @Input() selectedClubs: any;
  @Output() selected: EventEmitter<any> = new EventEmitter();
  data$: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(
    private service: ClubsService
  ) {
    super();
    this.privilegeType = CP_PRIVILEGES_MAP.clubs;
  }

  filterClubDataFromAccountPrivilege() {
    let _selectedClubs = {};
    Object.keys(this.selectedClubs).forEach(storeId => {
      if (this.selectedClubs[storeId][CP_PRIVILEGES_MAP.clubs]) {
        _selectedClubs[storeId] = {
          ...this.selectedClubs[storeId][CP_PRIVILEGES_MAP.clubs]
        };
      }
    });
    return _selectedClubs;
  }

  ngOnInit() {
    this
      .service
      .getClubs()
      .subscribe(clubs => {
        let res = {};
        let selected = {};

        if (this.selectedClubs) {
          selected = this.filterClubDataFromAccountPrivilege();

          clubs.map(club => {
            if (selected[club.store_id]) {
              club.checked = true;
              // we pass the id to the selected object
              // to populate the modal state....
              selected[club.store_id] = Object.assign(
                {},
                selected[club.store_id],
                { id: club.id }
              );
            }
          });
        }
        res = {
          data: clubs,
          selected: selected
        };

        this.data$.next(res);
      });
  }
}
