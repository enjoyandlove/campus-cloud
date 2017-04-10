import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-feed-dropdown',
  templateUrl: './feed-dropdown.component.html',
  styleUrls: ['./feed-dropdown.component.scss']
})
export class FeedDropdownComponent implements OnInit {
  @Input() isComment: boolean;
  @Input() requiresApproval: boolean;
  @Output() selected: EventEmitter<number> = new EventEmitter();

  options;

  constructor() { }

  ngOnInit() {
    let items = [
      {
        action: 2,
        label: 'Move Post',
        isPostOnly: true,
      },
      {
        action: 3,
        isPostOnly: false,
        label: `Delete ${this.isComment ? 'Comment' : 'Post'}`
      }
    ];

    if (this.requiresApproval) {
      const flaggedMenu = {
        action: 1,
        isPostOnly: false,
        label: `Approve ${this.isComment ? 'Comment' : 'Post'}`
      };

      items = [flaggedMenu, ...items];
    }

    this.options = this.isComment ? items.filter(item => !item.isPostOnly) : items;
  }
};
