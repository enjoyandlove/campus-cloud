import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-feed-dropdown',
  templateUrl: './feed-dropdown.component.html',
  styleUrls: ['./feed-dropdown.component.scss']
})
export class FeedDropdownComponent implements OnInit {
  @Input() isComment: boolean;
  @Input() isFlagged: boolean;
  @Output() selected: EventEmitter<number> = new EventEmitter();
  options;

  constructor() { }

  ngOnInit() {
    const items = [
      {
        action: 1,
        isPostOnly: false,
        isFlaggedOnly: true,
        label: `Approve ${this.isComment ? 'Comment' : 'Post'}`
      },
      {
        action: 2,
        label: 'Move Post',
        isPostOnly: true,
        isFlaggedOnly: false,
      },
      {
        action: 3,
        isPostOnly: false,
        isFlaggedOnly: false,
        label: `Delete ${this.isComment ? 'Comment' : 'Post'}`
      }
    ];

    this.options = this.isComment ? items.filter(item => !item.isPostOnly) : items;

    console.log(this);
  }
};
