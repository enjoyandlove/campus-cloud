import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '@campus-cloud/store';
import { ICase } from '../cases.interface';
declare var $: any;

@Component({
  selector: 'cp-case-delete',
  templateUrl: './case-delete.component.html',
  styleUrls: ['./case-delete.component.scss']
})
export class CaseDeleteComponent implements OnInit {
  @Input() case: ICase;

  constructor(public store: Store<fromStore.ICasesState | fromRoot.IHeader>) {}

  onDelete() {
    this.store.dispatch(new fromStore.DeleteCase(this.case));
    $('#deleteCase').modal('hide');
  }

  ngOnInit() {}
}
