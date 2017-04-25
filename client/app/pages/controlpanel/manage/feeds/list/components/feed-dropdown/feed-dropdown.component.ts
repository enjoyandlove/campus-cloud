import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'cp-feed-dropdown',
  templateUrl: './feed-dropdown.component.html',
  styleUrls: ['./feed-dropdown.component.scss']
})
export class FeedDropdownComponent implements OnInit {
  @Input() isComment: boolean;
  @Input() requiresApproval: boolean;
  @Input() isCampusWallView: Observable<number>;
  @Output() selected: EventEmitter<number> = new EventEmitter();

  options;
  _isCampusWallView;

  constructor() { }

  ngOnInit() {
    this.isCampusWallView.subscribe(res => {
      this._isCampusWallView = res === 1 ? true : false;
    });
    let items = [
      {
        action: 3,
        isPostOnly: false,
        label: `Delete ${this.isComment ? 'Comment' : 'Post'}`
      }
    ];

    if (this._isCampusWallView) {
      let approveMenu = {
        action: 2,
        label: 'Move Post',
        isPostOnly: true,
      };

      items = [approveMenu, ...items];
    }

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
