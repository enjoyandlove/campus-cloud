import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-feed-delete-modal',
  templateUrl: './feed-delete-modal.component.html',
  styleUrls: ['./feed-delete-modal.component.scss']
})
export class FeedDeleteModalComponent implements OnInit {
  @Input() feed: any;
  @Output() teardown: EventEmitter<null> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    // console.log(this);
  }
}
