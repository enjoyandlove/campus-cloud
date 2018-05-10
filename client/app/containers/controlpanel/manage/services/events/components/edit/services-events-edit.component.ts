import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cp-services-events-edit',
  templateUrl: './services-events-edit.component.html'
})
export class ServicesEventsEditComponent implements OnInit {
  isService = true;
  serviceId;

  constructor(private route: ActivatedRoute) {
    this.serviceId = this.route.snapshot.params['serviceId'];
  }

  ngOnInit() {}
}
