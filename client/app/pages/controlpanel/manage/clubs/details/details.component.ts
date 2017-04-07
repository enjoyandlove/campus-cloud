import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-clubs-details',
  template: '<router-outlet></router-outlet>'
})
export class ClubsDetailsComponent implements OnInit {
  clubId: number;
  constructor(
    private store: Store<any>,
    private route: ActivatedRoute
  ) {
    this.clubId = this.route.snapshot.params['clubId'];
  }

  buildHeader() {
    let menu = {
      heading: 'Club Name',
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
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: this.buildHeader()
    });
  }
}
