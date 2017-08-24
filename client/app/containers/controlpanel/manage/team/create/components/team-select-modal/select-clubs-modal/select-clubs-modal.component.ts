import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { CPSession } from '../../../../../../../../session';
import { ClubsService } from '../../../../../clubs/clubs.service';
import { CP_PRIVILEGES_MAP } from '../../../../../../../../shared/utils';
import { BaseTeamSelectModalComponent } from '../base/team-select-modal.component';

const PENDING_STATUS = 2;

@Component({
  selector: 'cp-select-clubs-modal',
  templateUrl: './select-clubs-modal.component.html'
})
export class SelectTeamClubsModalComponent extends BaseTeamSelectModalComponent
  implements OnInit {
  @Input() selectedClubs: any;
  @Input() reset: Observable<boolean>;
  @Output() selected: EventEmitter<any> = new EventEmitter();
  @Output() teardown: EventEmitter<null> = new EventEmitter();
  data$: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(
    private session: CPSession,
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

  doReset() {
    this.teardown.emit();
  }

  ngOnInit() {
    let search = new URLSearchParams();
    search.append('school_id', this.session.school.id.toString());

    this
      .service
      .getClubs(search, 1, 1000)
      .map(clubs => clubs.filter(club => club.status !== PENDING_STATUS))
      .subscribe(clubs => {
        let res = {};
        let selected = {};

        if (this.selectedClubs) {
          console.log('this.selectedClubs ', this.selectedClubs);
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
