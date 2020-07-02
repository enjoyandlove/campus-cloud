import { Component, OnInit, Input } from '@angular/core';
import { CPSession } from '@campus-cloud/session';

import {
  ICampusThread,
  ICampusThreadComment,
  ISocialGroupThread,
  ISocialGroupThreadComment
} from '@controlpanel/manage/feeds/model';

@Component({
  selector: 'cp-feed-deleted-by',
  templateUrl: './feed-deleted-by.component.html',
  styleUrls: ['./feed-deleted-by.component.scss']
})
export class FeedDeletedByComponent implements OnInit {
  message: string;
  @Input() feed:
    | ICampusThreadComment
    | ISocialGroupThreadComment
    | ICampusThread
    | ISocialGroupThread;

  constructor(private session: CPSession) {}

  ngOnInit(): void {
    const { deleter = {} } = this.feed;

    if (Object.keys(deleter).length == 0) {
      return;
    }

    const deletedByCurrentUser = deleter['email'] === this.session.g.get('user').email;

    this.message = deletedByCurrentUser
      ? 'you'
      : `[NOTRANSLATE]${deleter['name']} (${deleter['email']})[NOTRANSLATE]`;
  }
}
