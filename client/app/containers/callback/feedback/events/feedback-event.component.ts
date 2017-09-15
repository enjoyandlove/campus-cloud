import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { FeedbackService } from '../feedback.service';
import { BaseComponent } from '../../../../base/base.component';

@Component({
  selector: 'cp-feedback-event',
  templateUrl: './feedback-event.component.html',
  styleUrls: ['./feedback-event.component.scss']
})
export class FeedbackEventComponent extends BaseComponent implements OnInit {
  event;
  loading;
  isEvent = true;
  eventId: number;
  search: URLSearchParams = new URLSearchParams();
  isSubmitted$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
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
      .catch(_ => {});
  }

  onSubmit(data) {
    this
      .feedbackService
      .doEventFeedback(data, this.search)
      .subscribe(
        _ => this.isSubmitted$.next(true),
        err => { throw new Error(err) }
      );
  }

  ngOnInit() {
    this.search.append('id', this.eventId.toString());

    this.fetch();
  }
}
