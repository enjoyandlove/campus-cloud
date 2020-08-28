import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, Observable } from 'rxjs';
import { map, filter, takeUntil } from 'rxjs/operators';

import * as fromStore from '../store';
import * as fromRoot from '@campus-cloud/store';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';

import { BaseComponent } from '@campus-cloud/base/base.component';
import { ICase } from '../cases.interface';
import { CasesService } from '../cases.service';
import { HttpParams } from '@angular/common/http';
import { CPSession } from '@campus-cloud/session';
import { CaseLogComponent } from './components';

@Mixin([Destroyable])
@Component({
  selector: 'cp-case-details',
  templateUrl: './case-details.component.html',
  styleUrls: ['./case-details.component.scss']
})
export class CaseDetailsComponent extends BaseComponent implements OnInit {
  @ViewChild('caseLogList') caseLogList: CaseLogComponent;

  isSubmitted: boolean = true;
  isEditing: boolean = false;
  caseId;
  userId;
  case_status;
  case: ICase;
  loading: boolean;
  pageLoading: boolean;
  getCasesById$: Observable<any>;

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
      this.pageLoading = true;
      this.loading = true;
      this.getCasesById$ = this.store.select(fromStore.getCasesById).pipe(
        takeUntil(this.destroy$),
        filter((res: ICase) => !!res)
      );

      this.getCasesById$.subscribe((res: ICase) => {
        if (res) {
          this.case = res;
          this.loading = false;
          this.isEditing = false;
        }
        this.pageLoading = false;
      });
    } else {
      this.loading = true;
      const params = new HttpParams()
        .append('user_id', this.userId.toString())
        .append('school_id', this.session.g.get('school').id);

      const stream$ = this.service.getCaseById(params);

      stream$.toPromise().then((res: any) => {
        this.case = res[0];
        this.loading = false;
        this.isEditing = false;
      });
    }
  }

  onSubmitted(submitted) {
    this.isSubmitted = true;
    this.isEditing = false;
    this.loadCaseDetails();
  }

  onEditing(editing) {
    this.isEditing = editing;
  }

  onEditFinished() {
    this.loading = true;
  }

  ngOnInit() {
    if (this.caseId) {
      this.store.dispatch(new fromStore.SetSelectedCaseId({ id: this.caseId }));
      this.store.dispatch(new fromStore.GetCaseById({ id: this.caseId }));
    }

    this.loadCaseDetails();
    this.buildHeader();
  }
}
