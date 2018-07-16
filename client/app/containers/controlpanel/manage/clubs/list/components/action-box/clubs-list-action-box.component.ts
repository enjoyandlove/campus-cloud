import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CPSession } from './../../../../../../../session/index';
import { CP_PRIVILEGES_MAP } from './../../../../../../../shared/constants';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CP_TRACK_TO } from '../../../../../../../shared/directives/tracking';
import { CPTrackingService } from '../../../../../../../shared/services';
import { canSchoolWriteResource } from '../../../../../../../shared/utils/privileges/index';
import { ClubStatus } from '../../../club.status';
import { clubAthleticLabels, isClubAthletic } from '../../../clubs.athletics.labels';

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
  selectedItem = null;
  state: IState = state;
  isClubAthleticPrivilege;

  constructor(
    private session: CPSession,
    public route: ActivatedRoute,
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

  updateStateFromUrl() {
    const type = this.route.snapshot.queryParams['type'];

    this.state = {
      ...this.state,
      type
    };

    this.selectedItem = this.clubFilter.filter((c) => c.action === +type)[0];

    this.filter.emit(this.state);
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

    const hasTypeParam = this.route.snapshot.queryParamMap.get('type');

    if (hasTypeParam) {
      this.updateStateFromUrl();
    }
  }
}
