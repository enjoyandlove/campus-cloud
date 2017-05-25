import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cp-clubs-events',
  template: '<cp-events [isClub]="isClub" [clubId]="clubId"></cp-events>'
})
export class ClubsEventsComponent implements OnInit {
  clubId: number;
  isClub = true;

  constructor(
    private route: ActivatedRoute,
  ) {
    this.clubId = this.route.parent.snapshot.parent.params['clubId'];
  }

  ngOnInit() { }
}

  // <cp-events
  //   *ngSwitchCase="false"
  //   [isSimple]="isSimple"
  //   [isService]="isService"
  //   [serviceId]="serviceId"
  //   [storeId]="service.store_id">
  // </cp-events>
