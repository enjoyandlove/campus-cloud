import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { IUser } from '@app/session';
import { ManageHeaderService } from './utils/header';
import { IHeader, getHeaderState } from '@app/store/base';

@Component({
  selector: 'cp-manage',
  templateUrl: './manage.component.html'
})
export class ManageComponent implements OnInit {
  user: IUser;
  headerData$: Observable<IHeader>;

  constructor(private store: Store<any>, private headerService: ManageHeaderService) {
    this.headerData$ = this.store.select(getHeaderState);
  }
  ngOnInit() {
    this.headerService.updateHeader();
  }
}
