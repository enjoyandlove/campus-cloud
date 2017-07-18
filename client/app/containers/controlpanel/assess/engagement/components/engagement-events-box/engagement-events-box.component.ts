import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-engagement-events-box',
  templateUrl: './engagement-events-box.component.html',
  styleUrls: ['./engagement-events-box.component.scss']
})
export class EngagementEventsBoxComponent implements OnInit {
  stats: Array<any>;
  sortyBy: Array<{'label': string, 'action': number}>;

  eventsRanking;

  constructor() { }

  ngOnInit() {
    this.eventsRanking = [
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
        'title': 'Campus Cloud event',
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
        value: 100,
        label: 'Total Events',
        icon: 'chart_event.png'
      },
      {
        value: 90,
        label: 'Events Assessed',
        icon: 'chart_event-assess.png'
      },
      {
        value: 1000,
        label: 'Total Attendess',
        icon: 'chart_attendee.png'
      },
      {
        value: 4.5,
        label: 'Average Rating',
        icon: 'chart_rating.png'
      },
      {
        value: 200,
        label: 'Feedback Received',
        icon: 'chart_feedback.png'
      }
    ];
  }
}
