import { Component, OnInit } from '@angular/core';
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
          label: `[NOTRANSLATE]${this.datePipe.transform(
            start,
            FORMAT.SHORT
          )} - ${this.datePipe.transform(end, FORMAT.SHORT)}[NOTRANSLATE]`,
          onClick: () => {
            this.store.dispatch(fromStore.setEndFilter({ end: null }));
            this.store.dispatch(fromStore.setStartFilter({ start: null }));
          }
        };

        const groupTag = (groupName: string) => ({
          icon: 'ready-app',
          canClose: true,
          label: `[NOTRANSLATE]${groupName}[NOTRANSLATE]`,
          onClick: () => this.store.dispatch(fromStore.setGroup({ group: null }))
        });

        const postTag = (categoryName: string) => ({
          icon: 'ready-app',
          canClose: true,
          label: `[NOTRANSLATE]${categoryName}[NOTRANSLATE]`,
          onClick: () => this.store.dispatch(fromStore.setPostType({ postType: null }))
        });

        const flaggedByUserTag = {
          icon: 'flag',
          canClose: true,
          label: 'feeds_flagged_posts',
          onClick: () => this.store.dispatch(fromStore.setFlaggedByUser({ flagged: false }))
        };

        const usersTag = (label: string) => ({
          icon: 'person',
          canClose: true,
          label: `[NOTRANSLATE]${label}[NOTRANSLATE]`,
          onClick: () => this.store.dispatch(fromStore.clearFilterUsers())
        });

        const flaggedByModeratorTag = {
          canClose: true,
          icon: 'flag',
          label: 'feeds_removed_posts',
          onClick: () => this.store.dispatch(fromStore.setFlaggedByModerator({ flagged: false }))
        };

        if (postType) {
          tags.push(postTag(postType.name));
        }

        if (start && end) {
          tags.push(dateTag);
        }

        if (users.length) {
          tags.push(
            usersTag(
              users.length > 1
                ? this.cpI18nPipe.transform('t_walls_tags_users', users.length)
                : `${users[0].firstname} ${users[0].lastname}`
            )
          );
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

        if (!group && !postType) {
          tags.unshift({
            canClose: false,
            icon: 'ready-app',
            label: 't_all_walls_campus_walls_channels'
          });
        }

        return tags;
      })
    );
  }
}
