import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { ClubStatus } from '../../../club.status';
import { CPSession } from './../../../../../../../session/index';
import { CP_PRIVILEGES_MAP } from './../../../../../../../shared/constants';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';
import { canSchoolWriteResource } from '../../../../../../../shared/utils/privileges/index';
import { isClubAthletic, clubAthleticLabels } from '../../../clubs.athletics.labels';
import { CPTrackingService } from '../../../../../../../shared/services';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CP_TRACK_TO } from '../../../../../../../shared/directives/tracking';

interface IState {
  query: string;
  type: string;
}

const state: IState = {
  query: null,
  type: null
};

@Component({
  selector: 'cp-clubs-list-action-box',
  templateUrl: './clubs-list-action-box.component.html',
  styleUrls: ['./clubs-list-action-box.component.scss']
})
export class ClubsListActionBoxComponent implements OnInit {
  @Input() isAthletic = isClubAthletic.club;
  @Output() filter: EventEmitter<IState> = new EventEmitter();

  labels;
  clubFilter;
  canCreate;
  amplitudeEvents;
  state: IState = state;
  isClubAthleticPrivilege;

  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
    private cpTracking: CPTrackingService
  ) {}

  onUpdateState(data, key: string): void {
    this.state = Object.assign({}, this.state, { [key]: data });
    this.filter.emit(this.state);
  }

  trackEvent(eventName) {
    const createClubAthletic =
      this.isAthletic === isClubAthletic.athletic
        ? amplitudeEvents.CREATE_ATHLETIC
        : amplitudeEvents.CREATE_CLUB;

    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      create_page_name: createClubAthletic
    };

    return {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName,
      eventProperties
    };
  }

  ngOnInit() {
    this.isClubAthleticPrivilege =
      this.isAthletic === isClubAthletic.club
        ? CP_PRIVILEGES_MAP.clubs
        : CP_PRIVILEGES_MAP.athletics;
    this.canCreate = canSchoolWriteResource(this.session.g, this.isClubAthleticPrivilege);

    this.labels = clubAthleticLabels(this.isAthletic);

    this.amplitudeEvents = {
      clicked_create: amplitudeEvents.CLICKED_CREATE
    };

    this.clubFilter = [
      {
        label: this.cpI18n.translate(this.labels.all),
        action: null
      },
      {
        label: this.cpI18n.translate('active'),
        action: ClubStatus.active
      },
      {
        label: this.cpI18n.translate('clubs_inactive'),
        action: ClubStatus.inactive
      },
      {
        label: this.cpI18n.translate('pending'),
        action: ClubStatus.pending
      }
    ];
  }
}
