import { Component, Input, OnInit } from '@angular/core';

import { BaseComponent } from '../../../../../../base/base.component';

interface IProps {
  isDisable: boolean;
}

@Component({
  selector: 'cp-engagement-services-box',
  templateUrl: './engagement-services-box.component.html',
  styleUrls: ['./engagement-services-box.component.scss']
})
export class EngagementServicesBoxComponent extends BaseComponent implements OnInit {
  @Input() props: IProps;

  loading;
  servicesRanking;
  stats: Array<any>;
  sortyBy: Array<{ 'label': string, 'action': number }>;

  constructor() {
    super();
  }

  fakeDisable() {
    setTimeout(() => {
      this.props = Object.assign(
        {},
        this.props,
        { isDisable: !this.props.isDisable });
    }, 1000);
  }

  ngOnInit() {
    if (!this.props) {
      this.props = {
        isDisable: false
      };
    }

    this.loading = true;

    setTimeout(() => {
      this.loading = false;
      this.fakeDisable();
    }, 3000);

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
