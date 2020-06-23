import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import * as fromStore from '../../../store';
import { CPDatePipe, FORMAT, CPI18nPipe } from '@campus-cloud/shared/pipes';

interface Tag {
  icon: string;
  label: string;
  canClose: boolean;
  onClick?: () => void;
}

@Component({
  selector: 'cp-feed-tags',
  templateUrl: './feed-tags.component.html',
  styleUrls: ['./feed-tags.component.scss']
})
export class FeedTagsComponent implements OnInit {
  @Input()
  canCloseGroupTag: boolean;

  tags$: Observable<Tag[]>;
  constructor(
    private datePipe: CPDatePipe,
    private cpI18nPipe: CPI18nPipe,
    private store: Store<fromStore.IWallsState>
  ) {}

  ngOnInit() {
    this.tags$ = this.store.pipe(select(fromStore.getViewFilters)).pipe(
      map((filters) => {
        const tags = [];

        const { end, start, users, group, postType, flaggedByUser, flaggedByModerators } = filters;
        const dateTag = {
          icon: 'today',
          canClose: true,
          cssClass: 'date-tag',
          label: `${this.datePipe.transform(start, FORMAT.SHORT)} - ${this.datePipe.transform(
            end,
            FORMAT.SHORT
          )}`,
          onClick: () => {
            this.store.dispatch(fromStore.setEndFilter({ end: null }));
            this.store.dispatch(fromStore.setStartFilter({ start: null }));
          }
        };

        const groupTag = (groupName: string) => ({
          label: groupName,
          icon: 'ready-app',
          cssClass: 'channel-tag',
          onClick: () => this.store.dispatch(fromStore.setGroup({ group: null })),
          canClose: typeof this.canCloseGroupTag === 'undefined' ? true : this.canCloseGroupTag
        });

        const postTag = (categoryName: string) => ({
          canClose: true,
          icon: 'ready-app',
          label: categoryName,
          cssClass: 'channel-tag',
          onClick: () => this.store.dispatch(fromStore.setPostType({ postType: null }))
        });

        const flaggedByUserTag = {
          icon: 'flag',
          canClose: true,
          cssClass: 'status-tag',
          label: this.cpI18nPipe.transform('feeds_flagged_posts'),
          onClick: () => this.store.dispatch(fromStore.setFlaggedByUser({ flagged: false }))
        };

        const usersTag = (label: string) => ({
          label,
          icon: 'person',
          canClose: true,
          cssClass: 'user-tag',
          onClick: () => this.store.dispatch(fromStore.clearFilterUsers())
        });

        const flaggedByModeratorTag = {
          icon: 'flag',
          canClose: true,
          cssClass: 'status-tag',
          label: this.cpI18nPipe.transform('feeds_removed_posts'),
          onClick: () => this.store.dispatch(fromStore.setFlaggedByModerator({ flagged: false }))
        };

        if (users.length) {
          tags.push(
            usersTag(
              users.length > 1
                ? this.cpI18nPipe.transform('t_walls_tags_users', users.length)
                : `${users[0].firstname} ${users[0].lastname}`
            )
          );
        }

        if (postType) {
          tags.push(postTag(postType.name));
        }

        if (group) {
          tags.push(groupTag(group.name));
        }

        if (flaggedByUser) {
          tags.push(flaggedByUserTag);
        }

        if (flaggedByModerators) {
          tags.push(flaggedByModeratorTag);
        }

        if (start && end) {
          tags.push(dateTag);
        }

        return tags;
      })
    );
  }
}
