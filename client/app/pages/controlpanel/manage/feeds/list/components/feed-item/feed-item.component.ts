import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-feed-item',
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.scss']
})
export class FeedItemComponent implements OnInit {
  @Input() feed: any;

  constructor() { }

  ngOnInit() { }
}
