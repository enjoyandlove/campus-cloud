import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { IClub } from './../club.interface';
import { ClubsService } from '../clubs.service';
import { CPSession } from '../../../../../session';
import { ClubsUtilsService } from './../clubs.utils.service';
import { BaseComponent } from '../../../../../base/base.component';
import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';

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
        this.buildHeader();
      });
  }

  buildHeader() {
    const payload = this.buildPayload()

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload
    });
  }

  buildPayload() {
    let menu = {
      heading: this.club.name,
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

    const links = this.utils.getSubNavChildren(this.club, this.session);

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

