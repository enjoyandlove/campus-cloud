import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import {
  canSchoolReadResource,
  canStoreReadAndWriteResource
} from './../../../../../shared/utils/privileges';

import { ClubStatus } from '../club.status';
import { ClubsService } from '../clubs.service';
import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base/base.component';
import { CP_PRIVILEGES_MAP } from '../../../../../shared/constants';
import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-clubs-events',
  templateUrl: './clubs-events.component.html',
})
export class ClubsEventsComponent extends BaseComponent implements OnInit {
  club;
  loading;
  isClub = true;
  hasMembership;
  clubId: number;

  constructor(
    private router: Router,
    private store: Store<any>,
    private session: CPSession,
    private route: ActivatedRoute,
    private clubsService: ClubsService
  ) {
    super();

    this.clubId = this.route.parent.snapshot.parent.params['clubId'];

    super.isLoading().subscribe(loading => this.loading = loading);
  }

  private fetch() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    super
      .fetchData(this.clubsService.getClubById(this.clubId, search))
      .then(club => {
        this.club = club.data;

        this.hasMembership = club.data.has_membership;

        this.store.dispatch({
          type: HEADER_UPDATE,
          payload: this.buildHeader(club.data.name)
        });
      });
  }

  buildHeader(name) {
    let menu = {
      heading: name,
      subheading: null,
      'crumbs': {
        'url': this.router.url === `/manage/clubs/${this.clubId}/events/here`
          ? 'clubs'
          : `clubs/${this.clubId}`,
        'label': 'Clubs'
      },
      em: null,
      children: []
    };

    let links = [];

    const clubIsActive = this.club.status === ClubStatus.active;

    const clubIsPending = this.club.status !== ClubStatus.pending;

    const schoolAccess = (permission) => canSchoolReadResource(this.session.g, permission);

    const storeAccess = (permission) => {
      return canStoreReadAndWriteResource(this.session.g, this.clubId, permission);
    }

    if (clubIsActive &&
        schoolAccess(CP_PRIVILEGES_MAP.events) ||
        storeAccess(CP_PRIVILEGES_MAP.events)) {
      links = ['Events', ...links];
    }

    if (this.hasMembership) {
      if (clubIsPending &&
          schoolAccess(CP_PRIVILEGES_MAP.moderation) ||
          storeAccess(CP_PRIVILEGES_MAP.moderation)) {
        links = ['Wall', ...links];
      }

      if (schoolAccess(CP_PRIVILEGES_MAP.membership) ||
          storeAccess(CP_PRIVILEGES_MAP.membership)) {
        links = ['Members', ...links];
      }
    }

    links = ['Info', ...links];

    links.forEach(link => {
      menu.children.push({
        label: link,
        url: `/manage/clubs/${this.clubId}/${link.toLocaleLowerCase()}`
      });
    });

    return menu;
  }

  ngOnInit() {
    this.fetch();
  }
}

