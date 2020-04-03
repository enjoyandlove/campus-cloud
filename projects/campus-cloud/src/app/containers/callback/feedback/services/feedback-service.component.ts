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
  selector: 'cp-feedback-service',
  templateUrl: './feedback-service.component.html',
  styleUrls: ['./feedback-service.component.scss']
})
export class FeedbackServiceComponent extends BaseComponent implements OnInit {
  event;
  loading;
  isExist = true;
  isService = true;
  checkinId: number;
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

    this.checkinId = this.route.snapshot.params['service'];
  }

  fetch() {
    super
      .fetchData(this.feedbackService.getServiceData(this.search, true))
      .then((res) => (this.event = res.data))
      .catch((err) => {
        this.isExist = false;
        throw new Error(err);
      });
  }

  onSubmit(data) {
    this.feedbackService.doServiceFeedback(data, this.search).subscribe(
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
      FeedbackAmplitudeService.getFeedbackAmplitude(data, this.event, this.checkinId, true)
    );
  }

  ngOnInit() {
    if (!this.session.g.get('user')) {
      this.cpAmplitude.loadAmplitude();
    }

    this.search = new HttpParams().append('id', this.checkinId.toString());

    this.fetch();
  }
}
