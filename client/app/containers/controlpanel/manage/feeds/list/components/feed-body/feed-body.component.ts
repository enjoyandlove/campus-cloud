import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { CPI18nService } from '../../../../../../../shared/services/index';

@Component({
  selector: 'cp-feed-body',
  templateUrl: './feed-body.component.html',
  styleUrls: ['./feed-body.component.scss']
})
export class FeedBodyComponent implements OnInit {
  @Input() feed: any;
  @Input() isRemovedPosts: boolean;
  @Output() viewComments: EventEmitter<boolean> = new EventEmitter();

  constructor(
    public cpI18n: CPI18nService
  ) { }

  ngOnInit() { }
}
