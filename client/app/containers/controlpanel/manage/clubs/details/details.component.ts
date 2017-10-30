import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import {
  canSchoolReadResource,
  canStoreReadAndWriteResource
} from './../../../../../shared/utils/privileges';

import { IClub } from '../club.interface';
import { ClubStatus } from '../club.status';
import { ClubsService } from '../clubs.service';
import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base/base.component';
import { CP_PRIVILEGES_MAP } from '../../../../../shared/constants';
import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-clubs-details',
  template: '<router-outlet></router-outlet>'
})
export class ClubsDetailsComponent extends BaseComponent implements OnInit {
  loading;
  club: IClub;
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

    this.clubId = this.route.snapshot.params['clubId'];

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

        if (!((this.router.url.split('/').includes('facebook')))) {
          this.store.dispatch({
            type: HEADER_UPDATE,
            payload: this.buildHeader(club.data.name)
          });
        }
      });
  }

  buildHeader(name) {
    let menu = {
      heading: name,
      'crumbs': {
        'url': `clubs`,
        'label': 'Clubs'
      },
      subheading: null,
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

    const schoolOrStoreAccess = (permission) => schoolAccess(permission) || storeAccess(permission);

    if (clubIsActive && schoolOrStoreAccess(CP_PRIVILEGES_MAP.events)) {
      links = ['Events', ...links];
    }

    if (this.hasMembership) {
      if (clubIsPending && schoolOrStoreAccess(CP_PRIVILEGES_MAP.moderation)) {
        links = ['Wall', ...links];
      }

      if (schoolOrStoreAccess(CP_PRIVILEGES_MAP.membership)) {
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

  ngOnInit() { this.fetch(); }
}
