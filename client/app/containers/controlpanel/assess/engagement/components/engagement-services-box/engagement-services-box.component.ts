import { Component, Input, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { EngagementService } from '../../engagement.service';
import { BaseComponent } from '../../../../../../base/base.component';

const sortTypes = {
  0: null,
  1: 'feedback',
  2: 'rating'
};

interface IState {
  sortBy: string;
}

@Component({
  selector: 'cp-engagement-services-box',
  templateUrl: './engagement-services-box.component.html',
  styleUrls: ['./engagement-services-box.component.scss']
})
export class EngagementServicesBoxComponent extends BaseComponent implements OnInit {
  @Input() props: Observable<any>;

  loading;
  isDisable;
  isSorting;
  servicesRanking;
  state: IState = {
    sortBy: sortTypes[0]
  };
  stats: Array<any>;
  sortyBy: Array<{ 'label': string, 'action': number }>;

  constructor(
    private service: EngagementService
  ) {
    super();
  }

  onSortBy(sortBy) {
    this.isSorting = true;
    this.state = Object.assign(
      {},
      this.state,
      { sortBy: sortTypes[sortBy.action] }
    );

    this.fetch();
  }

  fetch() {
    if (!this.isSorting) {
      this.loading = true;
    }

    let search = new URLSearchParams();
    search.append('sort_by', this.state.sortBy);

    super
      .fetchData(this.service.getServicesData(search))
      .then(
        _ => {
          this.loading = false;
          this.isSorting = false;
        },
        _ => {
          this.loading = false;
          this.isSorting = false;
        }
      );
  }

  ngOnInit() {
    this.props.subscribe(res => {
      this.isDisable = res.engagement.data.type === 'events';

      if (!this.isDisable) {
        this.fetch();
      }
    });

    this.servicesRanking = [
      {
        'ranking': 1,
        'image': 'https://source.unsplash.com/random/38x38',
        'title': 'Some title',
        'attendees': 15,
        'feedback': 13,
        'rating': 4.3
      },
      {
        'ranking': 2,
        'image': 'https://source.unsplash.com/random/38x38',
        'title': 'Another Title',
        'attendees': 25,
        'feedback': 25,
        'rating': 4.1
      },
      {
        'ranking': 3,
        'image': 'https://source.unsplash.com/random/38x38',
        'title': 'Hello World',
        'attendees': 10,
        'feedback': 6,
        'rating': 3.6
      },
      {
        'ranking': 4,
        'image': 'https://source.unsplash.com/random/38x38',
        'title': 'Campus Cloud service',
        'attendees': 8,
        'feedback': 8,
        'rating': 3.1
      },
      {
        'ranking': 5,
        'image': 'https://source.unsplash.com/random/38x38',
        'title': 'Some title',
        'attendees': 15,
        'feedback': 13,
        'rating': 1.3
      }
    ];

    this.sortyBy = [
      {
        'label': 'Attendees',
        'action': null
      },
      {
        'label': 'Feedback',
        'action': 1
      },
      {
        'label': 'Rating',
        'action': 2
      }
    ];

    this.stats = [
      {
        value: 20,
        label: 'Total Services',
        icon: 'chart_service.png'
      },
      {
        value: 20,
        label: 'Services Assessed',
        icon: 'chart_service_assess.png'
      },
      {
        value: 305,
        label: 'Total Attendess',
        icon: 'chart_attendee.png'
      },
      {
        value: 3.2,
        label: 'Average Rating',
        icon: 'chart_rating.png'
      },
      {
        value: 173,
        label: 'Feedback Received',
        icon: 'chart_feedback.png'
      }
    ];
  }
}
