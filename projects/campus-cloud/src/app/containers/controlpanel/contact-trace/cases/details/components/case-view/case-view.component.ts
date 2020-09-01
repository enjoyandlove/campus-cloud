import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Store, ActionsSubject } from '@ngrx/store';

import { IItem } from '@campus-cloud/shared/components';
import * as fromStore from '../../../store';
import { CasesUtilsService } from '../../../cases.utils.service';
import { ICase, ICaseStatus } from '../../../cases.interface';
import { Subject } from 'rxjs';
@Component({
  selector: 'cp-case-view',
  templateUrl: './case-view.component.html',
  styleUrls: ['./case-view.component.scss']
})
export class CaseViewComponent implements OnInit {
  @Input() case: ICase;
  @Output() onEditing: EventEmitter<boolean> = new EventEmitter();
  @Output() onSubmitted: EventEmitter<boolean> = new EventEmitter();
  @Output() onPendingActionFinished: EventEmitter<boolean> = new EventEmitter();
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
    this.getCaseStatus();
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
  }

  getCaseStatus() {
    this.store.select(fromStore.getCaseStatus).subscribe((caseStatus: ICaseStatus[]) => {
      this.caseStatus = [...caseStatus];
      this.statusFilter = this.utils.getCaseStatusOptions(
        this.caseStatus.sort((a, b) => b.rank - a.rank)
      );
      this.selectedStatusFilter = this.statusFilter.filter(
        (item) => this.case.current_status.id === item.action
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
    this.newCase = JSON.parse(JSON.stringify(this.case));
    this.onEditing.emit(false);
  }

  ngOnInit(): void {
    if (this.case) {
      this.newCase = JSON.parse(JSON.stringify(this.case));
    }
    this.store.dispatch(new fromStore.GetCaseStatus());
  }

  traceContactAction(caseItem: ICase) {
    this.onPendingActionFinished.emit(false);
    const updatedCase = {
      ...caseItem,
      perform_current_action: true
    };
    this.store.dispatch(
      new fromStore.EditCase({
        body: updatedCase,
        id: caseItem.id
      })
    );
  }
}
