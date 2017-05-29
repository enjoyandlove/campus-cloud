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
  selector: 'cp-clubs-details',
  template: '<router-outlet></router-outlet>'
})
export class ClubsDetailsComponent extends BaseComponent implements OnInit {
  loading;
  clubId: number;

  constructor(
    private store: Store<any>,
    private session: CPSession,
    private route: ActivatedRoute,
    private clubsService: ClubsService
  ) {
    super();
    this.clubId = this.route.snapshot.params['clubId'];
    super.isLoading().subscribe(res => this.loading = res);
  }

  private fetch() {
    let search = new URLSearchParams();
    search.append('school_id', this.session.school.id.toString());

    super
      .fetchData(this.clubsService.getClubById(this.clubId, search))
      .then(club => {
        this.store.dispatch({
          type: HEADER_UPDATE,
          payload: this.buildHeader(club.data.name)
        });
      });
  }

  buildHeader(name) {
    let schoolPrivileges = this.session.user.school_level_privileges[this.clubId];
    let accountPrivilege = this.session.user.account_level_privileges[this.clubId];
    let menu = {
      heading: name,
      subheading: null,
      em: null,
      children: []
    };

    let links = ['Members', 'Info'];

    if (schoolPrivileges) {
      if (schoolPrivileges[CP_PRIVILEGES_MAP.events].r) {
        links = ['Events', ...links];
      }

      if (schoolPrivileges[CP_PRIVILEGES_MAP.moderation].r) {
        links = ['Wall', ...links];
      }
    }

    if (accountPrivilege) {
      if (links.indexOf('Events') === -1 &&
        accountPrivilege[CP_PRIVILEGES_MAP.events] &&
        accountPrivilege[CP_PRIVILEGES_MAP.events].r) {
        links = ['Events', ...links];
      }

      if (links.indexOf('Wall') === -1 &&
        accountPrivilege[CP_PRIVILEGES_MAP.moderation]
        && accountPrivilege[CP_PRIVILEGES_MAP.moderation].r) {
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
