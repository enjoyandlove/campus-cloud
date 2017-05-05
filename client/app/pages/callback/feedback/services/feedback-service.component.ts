import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { FeedbackService } from '../feedback.service';
import { BaseComponent } from '../../../../base/base.component';

@Component({
  selector: 'cp-feedback-service',
  templateUrl: './feedback-service.component.html',
  styleUrls: ['./feedback-service.component.scss']
})
export class FeedbackServiceComponent extends BaseComponent implements OnInit {
  event;
  loading;
  isService = true;
  checkinId: number;
  search: URLSearchParams = new URLSearchParams();
  isSubmitted$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private route: ActivatedRoute,
    private feedbackService: FeedbackService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);

    this.checkinId = this.route.snapshot.params['service'];
  }

  fetch() {
    super
      .fetchData(this.feedbackService.getServiceData(this.search))
      .then(res => this.event = res.data)
      .catch(err => console.error(err));
  }

  onSubmit(data) {
    this
      .feedbackService
      .doServiceFeedback(data, this.search)
      .subscribe(
        _ => this.isSubmitted$.next(true),
        err => console.error(err)
      );
  }

  ngOnInit() {
    this.search.append('id', this.checkinId.toString());

    this.fetch();
  }
}
