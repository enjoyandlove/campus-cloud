import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-feed-body',
  templateUrl: './feed-body.component.html',
  styleUrls: ['./feed-body.component.scss']
})
export class FeedBodyComponent implements OnInit {
  @Input() feed: any;
  @Output() viewComments: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() { }
}
