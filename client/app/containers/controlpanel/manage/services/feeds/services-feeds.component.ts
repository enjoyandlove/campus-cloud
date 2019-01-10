import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GroupType } from '../../feeds/feeds.utils.service';
import { ServicesUtilsService } from '../services.utils.service';

@Component({
  selector: 'cp-services-feeds',
  template: ` <cp-feeds
                [groupId]="storeId"
                [groupType]="groupType"
                hideIntegrations="true">
              </cp-feeds>`
})
export class ServicesFeedsComponent implements OnInit {
  service;
  storeId: number;
  groupType = GroupType.service;
  constructor(private route: ActivatedRoute, private utils: ServicesUtilsService) {}

  ngOnInit() {
    this.service = this.route.snapshot.data.service;
    this.storeId = this.service.store_id;
    this.utils.buildServiceHeader(this.service);
  }
}
