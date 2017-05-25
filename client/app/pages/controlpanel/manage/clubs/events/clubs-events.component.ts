import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ClubsService } from '../clubs.service';
import { CPSession } from '../../../../../session';
import { EventsService } from '../../events/events.service';
import { EventsComponent } from '../../events/list/base/events.component';

@Component({
  selector: 'cp-clubs-events',
  template: '<cp-events [IsClub]="IsClub" [storeId]="4443"></cp-events>'
})
export class ClubsEventsComponent extends EventsComponent implements OnInit {
  clubId: number;
  IsClub = true;

  constructor(
    public session: CPSession,
    private route: ActivatedRoute,
    public eventsService: EventsService,
    private clubsService: ClubsService
  ) {
    super(session, eventsService);
  }

  getClubDetails() {
    console.log(this.clubId);
    this
      .clubsService
      .getClubById(this.clubId)
      .subscribe(
        res => {
          console.log(res);
        });
  }

  ngOnInit() {
    this.clubId = this.route.parent.snapshot.params['clubId'];
    console.log(this.route);
    this.getClubDetails();
  }
}

  // <cp-events
  //   *ngSwitchCase="false"
  //   [isSimple]="isSimple"
  //   [isService]="isService"
  //   [serviceId]="serviceId"
  //   [storeId]="service.store_id">
  // </cp-events>
