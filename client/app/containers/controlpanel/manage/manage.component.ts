import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { IUser } from '../../../session';
import { ManageHeaderService } from './utils/header';
import { IHeader, HEADER_UPDATE } from '../../../reducers/header.reducer';

@Component({
  selector: 'cp-manage',
  templateUrl: './manage.component.html',
})
export class ManageComponent implements OnInit {
  user: IUser;
  headerData$: Observable<IHeader>;

  constructor(
    private router: Router,
    private store: Store<IHeader>,
    private headerService: ManageHeaderService
  ) {
    this.headerData$ = this.store.select('HEADER');
  }
  ngOnInit() {
    if (this.router.url.split('/').includes('facebook')) {
      /**
       * we want to prevent updating the header when on /import/facebook
       */
      return;
    }

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: this.headerService.filterByPrivileges()
    });
  }
}


// {
//   "privilege": 13,
//   "label": "Cover Photo",
//   "url": "/manage/customization"
// },
// {
//   "privilege": 21,
//   "label": "Locations",
//   "url": "/manage/locations"
// }
