import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { map, filter, takeUntil } from 'rxjs/operators';

import * as fromStore from '../store';
import * as fromRoot from '@campus-cloud/store';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';

import { BaseComponent } from '@campus-cloud/base/base.component';
import { ICase } from '../cases.interface';
import { CasesService } from '../cases.service';
import { HttpParams } from '@angular/common/http';
import { CPSession } from '@campus-cloud/session';

@Mixin([Destroyable])
@Component({
  selector: 'cp-case-details',
  templateUrl: './case-details.component.html',
  styleUrls: ['./case-details.component.scss']
})
export class CaseDetailsComponent extends BaseComponent implements OnInit, OnDestroy, Destroyable {
  isEditing: boolean = false;
  caseId;
  userId;
  case_status;
  case: ICase;
  loading: boolean;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    private route: ActivatedRoute,
    public store: Store<fromStore.State | fromRoot.IHeader>,
    public service: CasesService,
    private session: CPSession
  ) {
    super();
    this.caseId = this.route.snapshot.params['caseId']
      ? this.route.snapshot.params['caseId']
      : null;
    this.userId = this.route.snapshot.params['userId']
      ? this.route.snapshot.params['userId']
      : null;
  }

  buildHeader() {
    Promise.resolve().then(() => {
      this.store.dispatch({
        type: fromRoot.baseActions.HEADER_UPDATE,
        payload: {
          heading: 'case_details',
          crumbs: {
            url: 'cases',
            label: 'cases'
          },
          subheading: null,
          em: null,
          children: []
        }
      });
    });
  }

  loadCaseDetails() {
    if (this.caseId) {
      this.store
        .select(fromStore.getCasesById(this.caseId))
        .pipe(
          takeUntil(this.destroy$),
          filter((res: ICase) => !!res),
          map((res: ICase) => {
            this.case = res;
            this.buildHeader();
          })
        )
        .subscribe();
    } else {
      this.loading = true;
      const params = new HttpParams()
        .append('user_id', this.userId.toString())
        .append('school_id', this.session.g.get('school').id);

      const stream$ = this.service.getCaseById(params);

      stream$.toPromise().then((res: any) => {
        this.case = res[0];
        this.loading = false;
      });
    }
  }

  onEditing(editing) {
    this.isEditing = editing;
  }

  ngOnInit() {
    this.loadCaseDetails();
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
