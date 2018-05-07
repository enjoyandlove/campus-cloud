import { Component, OnInit } from '@angular/core';

import { FeedsComponent } from './base';
import { FeedsService } from '../feeds.service';
import { CPSession } from '../../../../../session';

@Component({
  selector: 'cp-feeds-list',
  templateUrl: './base/feeds.component.html',
  styleUrls: ['./base/feeds.component.scss'],
})
export class FeedsListComponent extends FeedsComponent implements OnInit {
  feeds;
  loading;

  constructor(public session: CPSession, public service: FeedsService) {
    super(session, service);
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  ngOnInit() {}
}
