import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EventsService } from '../../events/events.service';
import { EventsComponent } from '../../events/list/base/events.component';

@Component({
  selector: 'cp-clubs-events',
  templateUrl: '../../events/list/base/events.component.html',
})
export class ClubsEventsComponent extends EventsComponent implements OnInit {
  clubId: number;

  constructor(
    private route: ActivatedRoute,
    public eventsService: EventsService
  ) {
    super(eventsService);
    this.clubId = this.route.parent.snapshot.params['clubId'];
  }

  ngOnInit() { }
}
