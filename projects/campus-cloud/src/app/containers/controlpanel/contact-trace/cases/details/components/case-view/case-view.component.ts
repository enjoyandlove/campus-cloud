import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Store, ActionsSubject } from '@ngrx/store';

import { IItem } from '@campus-cloud/shared/components';
import * as fromStore from '../../../store';
import { CasesUtilsService } from '../../../cases.utils.service';
import { ICase, ICaseStatus } from '../../../cases.interface';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
@Component({
  selector: 'cp-case-view',
  templateUrl: './case-view.component.html',
  styleUrls: ['./case-view.component.scss']
})
export class CaseViewComponent implements OnInit {
  @Input() case: ICase;
  @Output() onEditing: EventEmitter<boolean> = new EventEmitter();
  @Output() onSubmitted: EventEmitter<boolean> = new EventEmitter();

  isEditing: boolean;
  newCase: ICase;
  selectedStatusFilter: IItem;
  caseStatus: ICaseStatus[];
  statusFilter: IItem[];
  private destroy$ = new Subject();

  constructor(
    public store: Store<fromStore.State>,
    public utils: CasesUtilsService,
    public actionsSubject$: ActionsSubject
  ) {}

  onEdit() {
    this.isEditing = true;
    this.onEditing.emit(true);
  }

  onSubmit() {
    const caseId = this.case.id;
    const body = this.newCase;
    const payload = {
      body,
      id: caseId
    };

    this.store.dispatch(new fromStore.EditCase(payload));
    this.isEditing = false;
  }

  getCaseStatus() {
    this.store.select(fromStore.getCaseStatus).subscribe((caseStatus: ICaseStatus[]) => {
      this.caseStatus = [...caseStatus];
      this.statusFilter = this.utils.getCaseStatusOptions(this.caseStatus);
      this.selectedStatusFilter = this.statusFilter.filter(
        (item) => this.case.current_status_id === item.action
      )[0];
    });
  }

  onStatusFilter(currentStatus: IItem) {
    this.selectedStatusFilter = currentStatus;
    this.newCase.current_status_id = Number(this.selectedStatusFilter.action);

    this.newCase.current_status = this.caseStatus.filter(
      (item) => item.id === currentStatus.action
    )[0];
  }

  onCancel() {
    this.isEditing = false;
    this.onEditing.emit(false);
  }

  listenForUpdateCase() {
    this.actionsSubject$
      .pipe(
        takeUntil(this.destroy$),
        filter((action) => action.type === fromStore.caseActions.EDIT_CASE_SUCCESS)
      )
      .subscribe(() => {
        this.onSubmitted.emit(true);
      });
  }

  ngOnInit(): void {
    this.newCase = JSON.parse(JSON.stringify(this.case));
    this.listenForUpdateCase();
    this.getCaseStatus();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
