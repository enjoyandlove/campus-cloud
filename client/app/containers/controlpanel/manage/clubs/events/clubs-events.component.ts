import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { ClubsService } from '../clubs.service';
import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base/base.component';
import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';
import { CP_PRIVILEGES_MAP } from '../../../../../shared/utils/privileges';


@Component({
  selector: 'cp-clubs-events',
  templateUrl: './clubs-events.component.html',
})
export class ClubsEventsComponent extends BaseComponent implements OnInit {
  loading;
  isClub = true;
  hasMembership;
  clubId: number;

  constructor(
    private store: Store<any>,
    private session: CPSession,
    private route: ActivatedRoute,
    private clubsService: ClubsService
  ) {
    super();
    this.clubId = this.route.parent.snapshot.parent.params['clubId'];
    super.isLoading().subscribe(res => this.loading = res);
  }

  private fetch() {
    let search = new URLSearchParams();
    search.append('school_id', this.session.school.id.toString());

    super
      .fetchData(this.clubsService.getClubById(this.clubId, search))
      .then(club => {
        this.hasMembership = club.data.has_membership;

        this.store.dispatch({
          type: HEADER_UPDATE,
          payload: this.buildHeader(club.data.name)
        });
      });
  }

  buildHeader(name) {
    let schoolPrivileges = this.session.user.school_level_privileges[this.session.school.id];
    let accountPrivileges = this.session.user.account_level_privileges[this.clubId];
    let menu = {
      heading: name,
      subheading: null,
      em: null,
      children: []
    };

    let links = ['Info'];

    if (schoolPrivileges) {
      if (schoolPrivileges[CP_PRIVILEGES_MAP.events].r) {
        links = ['Events', ...links];
      }

      if (this.hasMembership) {
        if (schoolPrivileges[CP_PRIVILEGES_MAP.membership].r) {
          links = ['Members', ...links];
        }

        if (schoolPrivileges[CP_PRIVILEGES_MAP.moderation].r) {
          links = ['Wall', ...links];
        }
      }
    }

    if (accountPrivileges) {
      if (links.indexOf('Events') === -1 &&
        accountPrivileges[CP_PRIVILEGES_MAP.events] &&
        accountPrivileges[CP_PRIVILEGES_MAP.events].r) {
        links = ['Events', ...links];
      }

      if (links.indexOf('Members') === -1 &&
        this.hasMembership &&
        accountPrivileges[CP_PRIVILEGES_MAP.membership]
        && accountPrivileges[CP_PRIVILEGES_MAP.membership].r) {
        links = ['Members', ...links];
      }

      if (links.indexOf('Wall') === -1 &&
        this.hasMembership &&
        accountPrivileges[CP_PRIVILEGES_MAP.moderation]
        && accountPrivileges[CP_PRIVILEGES_MAP.moderation].r) {
        links = ['Wall', ...links];
      }
    }

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

