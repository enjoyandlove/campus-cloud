import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CPI18nService } from '../../../../../../../shared/services/index';

@Component({
  selector: 'cp-feed-dropdown',
  templateUrl: './feed-dropdown.component.html',
  styleUrls: ['./feed-dropdown.component.scss'],
})
export class FeedDropdownComponent implements OnInit {
  @Input() isComment: boolean;
  @Input() requiresApproval: Observable<boolean>;
  @Input() isCampusWallView: Observable<number>;
  @Output() selected: EventEmitter<number> = new EventEmitter();

  options;
  _isCampusWallView;
  _requiresApproval;

  constructor(public cpI18n: CPI18nService) {}

  removeApproveOption() {
    this.options = this.options.filter((option) => option.action !== 1);
  }

  ngOnInit() {
    if (!this.requiresApproval) {
      return this.requiresApproval.startWith(false);
    }

    this.isCampusWallView.subscribe((res: any) => {
      this._isCampusWallView = res.type === 1;
    });

    this.requiresApproval.subscribe((requiresApproval) => {
      this._requiresApproval = requiresApproval;

      if (!requiresApproval && this.options) {
        this.removeApproveOption();
      }
    });

    let items = [
      {
        action: 3,
        isPostOnly: false,
        label: this.cpI18n.translate(
          this.isComment ? 'feeds_delete_comment' : 'feeds_delete_post',
        ),
      },
    ];

    if (this._isCampusWallView) {
      const approveMenu = {
        action: 2,
        label: this.cpI18n.translate('feeds_move_post'),
        isPostOnly: true,
      };

      items = [approveMenu, ...items];
    }

    if (this._requiresApproval) {
      const flaggedMenu = {
        action: 1,
        isPostOnly: false,
        label: this.cpI18n.translate(
          this.isComment ? 'feeds_approve_comment' : 'feeds_approve_post',
        ),
      };

      items = [flaggedMenu, ...items];
    }

    this.options = this.isComment
      ? items.filter((item) => !item.isPostOnly)
      : items;
  }
}
