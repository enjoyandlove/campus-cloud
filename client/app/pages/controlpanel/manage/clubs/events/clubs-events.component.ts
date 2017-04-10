import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EventsService } from '../../events/events.service';
// import { ClubsEventsService } from './events.services';
import { EventsComponent } from '../../events/list/base/events.component';

@Component({
  selector: 'cp-clubs-events',
  templateUrl: '../../events/list/base/events.component.html',
  styleUrls: ['../../events/list/base/events.component.scss']
})
export class ClubsEventsComponent extends EventsComponent implements OnInit {
  clubId: number;

  constructor(
    private route: ActivatedRoute,
    public eventsService: EventsService
  ) {
    super(eventsService);
    this.isSimple = true;
    this.clubId = this.route.parent.snapshot.params['clubId'];
  }

  ngOnInit() { }
}
