import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { ClubStatus } from '../../../club.status';
import { CPSession } from './../../../../../../../session/index';
import { CP_PRIVILEGES_MAP } from './../../../../../../../shared/constants';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';
import { canSchoolWriteResource } from '../../../../../../../shared/utils/privileges/index';

interface IState {
  query: string;
  type: string;
}

const state: IState = {
  query: null,
  type: null,
};

@Component({
  selector: 'cp-clubs-list-action-box',
  templateUrl: './clubs-list-action-box.component.html',
  styleUrls: ['./clubs-list-action-box.component.scss'],
})
export class ClubsListActionBoxComponent implements OnInit {
  @Output() filter: EventEmitter<IState> = new EventEmitter();

  clubFilter;
  canCreate;
  state: IState = state;

  constructor(private session: CPSession, private cpI18n: CPI18nService) {}

  onUpdateState(data, key: string): void {
    this.state = Object.assign({}, this.state, { [key]: data });
    this.filter.emit(this.state);
  }

  ngOnInit() {
    this.canCreate = canSchoolWriteResource(
      this.session.g,
      CP_PRIVILEGES_MAP.clubs,
    );

    this.clubFilter = [
      {
        label: this.cpI18n.translate('clubs_all_clubs'),
        action: null,
      },
      {
        label: this.cpI18n.translate('active'),
        action: ClubStatus.active,
      },
      {
        label: this.cpI18n.translate('clubs_inactive'),
        action: ClubStatus.inactive,
      },
      {
        label: this.cpI18n.translate('pending'),
        action: ClubStatus.pending,
      },
    ];
  }
}
