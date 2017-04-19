import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { FeedsService } from '../../../feeds.service';

declare var $: any;

@Component({
  selector: 'cp-feed-delete-modal',
  templateUrl: './feed-delete-modal.component.html',
  styleUrls: ['./feed-delete-modal.component.scss']
})
export class FeedDeleteModalComponent implements OnInit {
  @Input() feed: any;
  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  constructor(
    private feedsService: FeedsService
  ) { }

  onDelete() {
    this
      .feedsService
      .deleteById(this.feed.id)
      .subscribe(
        _ => {
          $('#deleteFeedModal').modal('hide');
          this.deleted.emit(this.feed.id);
          this.teardown.emit();
        },
        err => console.log(err)
      );
  }

  ngOnInit() {
    console.log(this);
  }
}
