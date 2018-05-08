import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { BaseComponent } from '../../../../../base/base.component';
import { CPSession } from '../../../../../session';
import { ClubsService } from '../clubs.service';

import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';

import { IClub } from './../club.interface';
import { ClubsUtilsService } from './../clubs.utils.service';
import { clubAthleticLabels, isClubAthletic } from '../clubs.athletics.labels';

@Component({
  selector: 'cp-clubs-events',
  templateUrl: './clubs-events.component.html'
})
export class ClubsEventsComponent extends BaseComponent implements OnInit {
  @Input() isAthletic = isClubAthletic.club;

  labels;
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

    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  private fetch() {
    const search = new HttpParams();
    search.append('school_id', this.session.g.get('school').id.toString());
    search.append('category_id', this.isAthletic.toString());

    super.fetchData(this.clubsService.getClubById(this.clubId, search)).then((club) => {
      this.club = club.data;
      this.buildHeader();
    });
  }

  buildHeader() {
    const payload = this.buildPayload();

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload
    });
  }

  buildPayload() {
    const menu = {
      heading: `[NOTRANSLATE]${this.club.name}[NOTRANSLATE]`,
      subheading: null,
      crumbs: {
        url:
          this.router.url === `/manage/` + this.labels.club_athletic + `/${this.clubId}/events`
            ? this.labels.club_athletic
            : this.labels.club_athletic + `/${this.clubId}`,
        label: this.labels.club_athletic
      },
      em: null,
      children: []
    };

    const links = this.utils.getSubNavChildren(this.club, this.session);

    links.forEach((link) => {
      menu.children.push({
        label: link.toLocaleLowerCase(),
        url: `/manage/` + this.labels.club_athletic + `/${this.clubId}/${link.toLocaleLowerCase()}`
      });
    });

    return menu;
  }

  ngOnInit() {
    this.labels = clubAthleticLabels(this.isAthletic);
    this.fetch();
  }
}
