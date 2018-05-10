import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { BaseComponent } from '../../../../base/base.component';
import { FeedbackService } from '../feedback.service';

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
  search: URLSearchParams = new URLSearchParams();
  isSubmitted$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private route: ActivatedRoute, private feedbackService: FeedbackService) {
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
      (_) => this.isSubmitted$.next(true),
      (err) => {
        throw new Error(err);
      }
    );
  }

  ngOnInit() {
    this.search.append('id', this.checkinId.toString());

    this.fetch();
  }
}
