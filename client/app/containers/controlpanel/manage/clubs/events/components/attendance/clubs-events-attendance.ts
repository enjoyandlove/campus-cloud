import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: ' cp-clubs-events-attendance.',
  templateUrl: './clubs-events-attendance.html'
})
export class ClubsEventsAttendanceComponent implements OnInit {
  @Input() isAthletic;

  clubId;
  isClub = true;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.clubId = this.route.snapshot.parent.parent.params['clubId'];
  }
}
