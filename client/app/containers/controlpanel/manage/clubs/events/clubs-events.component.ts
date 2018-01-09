import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { BaseComponent } from '../../../../../base/base.component';
import { CPSession } from '../../../../../session';
import { ClubsService } from '../clubs.service';

import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';

import { IClub } from './../club.interface';
import { ClubsUtilsService } from './../clubs.utils.service';

@Component({
  selector: 'cp-clubs-events',
  templateUrl: './clubs-events.component.html',
})
export class ClubsEventsComponent extends BaseComponent implements OnInit {
  loading;
  club: IClub;
  isClub = true;
  clubId: number;

  constructor(
    private router: Router,
    private store: Store<any>,
    private session: CPSession,
    private route: ActivatedRoute,
    private utils: ClubsUtilsService,
    private clubsService: ClubsService,
  ) {
    super();

    this.clubId = this.route.parent.snapshot.parent.params['clubId'];

    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  private fetch() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    super
      .fetchData(this.clubsService.getClubById(this.clubId, search))
      .then((club) => {
        this.club = club.data;
        this.buildHeader();
      });
  }

  buildHeader() {
    const payload = this.buildPayload();

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload,
    });
  }

  buildPayload() {
    const menu = {
      heading: `[NOTRANSLATE]${this.club.name}[NOTRANSLATE]`,
      subheading: null,
      crumbs: {
        url:
          this.router.url === `/manage/clubs/${this.clubId}/events`
            ? 'clubs'
            : `clubs/${this.clubId}`,
        label: 'clubs',
      },
      em: null,
      children: [],
    };

    const links = this.utils.getSubNavChildren(this.club, this.session);

    links.forEach((link) => {
      menu.children.push({
        label: `[NOTRANSLATE]${link}[NOTRANSLATE]`,
        url: `/manage/clubs/${this.clubId}/${link.toLocaleLowerCase()}`,
      });
    });

    return menu;
  }

  ngOnInit() {
    this.fetch();
  }
}
