import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-feed-approve-modal',
  templateUrl: './feed-approve-modal.component.html',
  styleUrls: ['./feed-approve-modal.component.scss']
})
export class FeedApproveModalComponent implements OnInit {
  @Input() feed: any;
  @Output() teardown: EventEmitter<null> = new EventEmitter();

  constructor() { }

  ngOnInit() { }
}
