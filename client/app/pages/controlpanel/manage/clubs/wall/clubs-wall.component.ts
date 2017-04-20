import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FeedsService } from '../../feeds/feeds.service';
import { FeedsComponent } from '../../feeds/list/base/feeds.component';

@Component({
  selector: 'cp-clubs-wall',
  templateUrl: '../../feeds/list/base/feeds.component.html',
})
export class ClubsWallComponent extends FeedsComponent implements OnInit {
  clubId: number;
  isSimple = true;

  constructor(
    public service: FeedsService,
    private route: ActivatedRoute
  ) {
    super(service);
    this.clubId = this.route.parent.snapshot.params['clubId'];
  }


  ngOnInit() {
  }
}
