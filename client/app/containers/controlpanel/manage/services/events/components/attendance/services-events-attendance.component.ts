import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cp-services-events-attendance',
  templateUrl: './services-events-attendance.component.html'
})
export class ServicesEventsAttendanceComponent implements OnInit {
  isService = true;
  serviceId;

  constructor(private route: ActivatedRoute) {
    this.serviceId = this.route.snapshot.params['serviceId'];
  }

  ngOnInit() {}
}
