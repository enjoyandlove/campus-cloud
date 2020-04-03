import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { BaseComponent } from '@campus-cloud/base';
import { FeedbackService } from '../feedback.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { FeedbackAmplitudeService } from '../feedback.amplitude.service';
import { CPAmplitudeService, CPTrackingService } from '@campus-cloud/shared/services';

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
  search: HttpParams;
  isSubmitted$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private session: CPSession,
    private route: ActivatedRoute,
    private cpTracking: CPTrackingService,
    private cpAmplitude: CPAmplitudeService,
    private feedbackService: FeedbackService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));

    this.eventId = this.route.snapshot.params['event'];
  }

  fetch() {
    super
      .fetchData(this.feedbackService.getEventData(this.search))
      .then((res) => (this.event = res.data))
      .catch((_) => {});
  }

  onSubmit(data) {
    this.feedbackService.doEventFeedback(data, this.search).subscribe(
      () => {
        this.feedbackAmplitude(data);
        this.isSubmitted$.next(true);
      },
      (err) => {
        throw new Error(err);
      }
    );
  }

  feedbackAmplitude(data) {
    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.ASSESS_SUBMITTED_FEEDBACK,
      FeedbackAmplitudeService.getFeedbackAmplitude(data, this.event, this.eventId)
    );
  }

  ngOnInit() {
    if (!this.session.g.get('user')) {
      this.cpAmplitude.loadAmplitude();
    }

    this.search = new HttpParams().append('id', this.eventId.toString());

    this.fetch();
  }
}
