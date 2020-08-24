import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { ICaseStatus } from '../../../cases.interface';
import { Observable, Subject } from 'rxjs';
import * as fromStore from '../../../store';
@Component({
  selector: 'cp-case-total-count-view',
  templateUrl: './case-total-count-view.component.html',
  styleUrls: ['./case-total-count-view.component.scss']
})
export class CaseTotalCountViewComponent implements OnInit {
  caseStatus$: Observable<ICaseStatus[]>;

  constructor(public store: Store<fromStore.ICasesState>) {}

  getCaseStatus() {
    this.caseStatus$ = this.store.select(fromStore.getCaseStatus).pipe(
      map((caseStatus: ICaseStatus[]) => {
        const responseCopy = [...caseStatus];
        return responseCopy;
      })
    );
  }

  ngOnInit(): void {
    this.getCaseStatus();
  }
}
