import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ClubsUtilsService } from './../../../../clubs.utils.service';
import { isClubAthletic } from '../../../../clubs.athletics.labels';
import { CPSession } from '../../../../../../../../session';

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
    public route: ActivatedRoute
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
