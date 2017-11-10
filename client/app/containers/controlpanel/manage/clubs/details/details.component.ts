import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';


import { IClub } from '../club.interface';
import { ClubsService } from '../clubs.service';
import { CPSession } from '../../../../../session';
import { ClubsUtilsService } from '../clubs.utils.service';
import { BaseComponent } from '../../../../../base/base.component';
import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-clubs-details',
  template: '<router-outlet></router-outlet>'
})
export class ClubsDetailsComponent extends BaseComponent implements OnInit {
  loading;
  club: IClub;
  clubId: number;

  constructor(
    private router: Router,
    private store: Store<any>,
    private session: CPSession,
    private route: ActivatedRoute,
    private cpI18n: CPI18nService,
    private utils: ClubsUtilsService,
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
        'label': this.cpI18n.translate('clubs')
      },
      subheading: null,
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

  ngOnInit() { this.fetch(); }
}
