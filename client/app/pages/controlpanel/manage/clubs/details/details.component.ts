import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { ClubsService } from '../clubs.service';
import { BaseComponent } from '../../../../../base/base.component';
import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-clubs-details',
  template: '<router-outlet></router-outlet>'
})
export class ClubsDetailsComponent extends BaseComponent implements OnInit {
  loading;
  clubId: number;

  constructor(
    private store: Store<any>,
    private route: ActivatedRoute,
    private clubsService: ClubsService
  ) {
    super();
    this.clubId = this.route.snapshot.params['clubId'];
    super.isLoading().subscribe(res => this.loading = res);
  }

  private fetch() {
    super
      .fetchData(this.clubsService.getClubsbyId(this.clubId))
      .then(club => {
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
      em: null,
      children: []
    };

    const links = ['Wall', 'Events', 'Members', 'Info'];

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
