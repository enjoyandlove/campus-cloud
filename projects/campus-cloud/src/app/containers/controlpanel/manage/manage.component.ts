import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ManageHeaderService } from './utils/header';
import { IHeader, getHeaderState } from '@campus-cloud/store/base';

@Component({
  selector: 'cp-manage',
  templateUrl: './manage.component.html'
})
export class ManageComponent implements OnInit {
  headerData$: Observable<IHeader> = this.store.pipe(select(getHeaderState));

  constructor(private store: Store<any>, private headerService: ManageHeaderService) {}

  ngOnInit() {
    this.headerService.updateHeader();
  }
}
