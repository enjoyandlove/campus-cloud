import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { FeedbackService } from '../feedback.service';
import { BaseComponent } from '../../../../base/base.component';

@Component({
  selector: 'cp-feedback-event',
  templateUrl: './feedback-event.component.html',
  styleUrls: ['./feedback-event.component.scss']
})
export class FeedbackEventComponent extends BaseComponent implements OnInit {
  loading;
  event;
  isEvent = true;
  eventId: number;
  search: URLSearchParams = new URLSearchParams();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private feedbackService: FeedbackService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);

    this.eventId = this.route.snapshot.params['event'];
  }

  fetch() {
    super
      .fetchData(this.feedbackService.getEventData(this.search))
      .then(res => this.event = res.data)
      .catch(err => console.error(err));
  }

  onSubmit(data) {
    console.log(data);
  }

  ngOnInit() {
    this.search.append('id', this.eventId.toString());

    this.fetch();
  }
}
