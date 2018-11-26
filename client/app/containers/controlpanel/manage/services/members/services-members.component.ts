import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ServicesUtilsService } from '../services.utils.service';

@Component({
  selector: 'cp-services-members',
  template: `<cp-clubs-members
              [storeId]="storeId">
             </cp-clubs-members>`
})
export class ServicesMembersComponent implements OnInit {
  service;
  storeId: number;

  constructor(private route: ActivatedRoute, private utils: ServicesUtilsService) {}

  ngOnInit() {
    this.service = this.route.snapshot.data.service;
    this.storeId = this.service.store_id;
    this.utils.buildServiceHeader(this.service);
  }
}
