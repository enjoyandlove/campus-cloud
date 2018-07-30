import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CPSession } from '../../../../../../../../session';
import { isClubAthletic } from '../../../../clubs.athletics.labels';
import { ClubsUtilsService } from './../../../../clubs.utils.service';
import { CPTrackingService } from '../../../../../../../../shared/services';
import { CP_TRACK_TO } from '../../../../../../../../shared/directives/tracking';
import { amplitudeEvents } from '../../../../../../../../shared/constants/analytics';

@Component({
  selector: 'cp-clubs-members-action-box',
  templateUrl: './action-box.component.html',
  styleUrls: ['./action-box.component.scss']
})
export class ClubsMembersActionBoxComponent implements OnInit {
  @Input() isAthletic = isClubAthletic.club;
  @Output() create: EventEmitter<null> = new EventEmitter();
  @Output() search: EventEmitter<string> = new EventEmitter();

  clubId;
  limitedAdmin;

  constructor(
    public helper: ClubsUtilsService,
    public session: CPSession,
    public route: ActivatedRoute,
    public cpTracking: CPTrackingService
  ) {}

  onSearch(query) {
    this.search.emit(query);
  }

  trackChangeEvent() {
    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_name: amplitudeEvents.MEMBER
    };

    return {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.CLICKED_CHANGE_BUTTON,
      eventProperties
    };
  }

  ngOnInit() {
    this.clubId = this.route.snapshot.parent.parent.parent.params['clubId'];

    this.limitedAdmin =
      this.isAthletic === isClubAthletic.club
        ? this.helper.limitedAdmin(this.session.g, this.clubId)
        : false;
  }
}
