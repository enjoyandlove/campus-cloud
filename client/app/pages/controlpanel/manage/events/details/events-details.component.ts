import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EventsService } from '../events.service';
import { BaseComponent } from '../../../../../base/base.component';


@Component({
  selector: 'cp-events-details',
  templateUrl: './events-details.component.html',
  styleUrls: ['./events-details.component.scss']
})
export class EventsDetailsComponent extends BaseComponent implements OnInit {
  event;
  loading = true;
  eventId: number;

  constructor(
    private route: ActivatedRoute,
    private service: EventsService
  ) {
    super();
    this.eventId = this.route.snapshot.params['eventId'];
    this.fetch();
    this.service.getEventById(this.eventId).subscribe(res => console.log(res));
  }

  private fetch() {
    super.isLoading().subscribe(res => this.loading = res);

    super
      .fetchData(this.service.getEventById(this.eventId))
      .then(res => this.event = res)
      .catch(err => console.error(err));
  }

  ngOnInit() { }
}
