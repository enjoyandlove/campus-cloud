import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CPSession } from '../../../../../../../../session';
import { isClubAthletic } from '../../../../clubs.athletics.labels';
import { ClubsUtilsService } from './../../../../clubs.utils.service';

@Component({
  selector: 'cp-clubs-members-action-box',
  templateUrl: './action-box.component.html',
  styleUrls: ['./action-box.component.scss']
})
export class ClubsMembersActionBoxComponent implements OnInit {
  @Input() hasMembers: boolean;
  @Input() isAthletic = isClubAthletic.club;
  @Output() create: EventEmitter<null> = new EventEmitter();
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() download: EventEmitter<null> = new EventEmitter();

  clubId;
  eventData;
  limitedAdmin;

  constructor(
    public session: CPSession,
    public route: ActivatedRoute,
    public helper: ClubsUtilsService
  ) {}

  onSearch(query) {
    this.search.emit(query);
  }

  ngOnInit() {
    this.clubId = this.route.snapshot.parent.parent.parent.params['clubId'];

    this.limitedAdmin =
      this.isAthletic === isClubAthletic.club
        ? this.helper.limitedAdmin(this.session.g, this.clubId)
        : false;
  }
}
