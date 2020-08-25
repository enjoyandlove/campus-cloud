import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { IItem } from '@campus-cloud/shared/components';
import * as fromStore from '../../../store';
import { CasesUtilsService } from '../../../cases.utils.service';
import { ICase, ICaseStatus } from '../../../cases.interface';
@Component({
  selector: 'cp-case-view',
  templateUrl: './case-view.component.html',
  styleUrls: ['./case-view.component.scss']
})
export class CaseViewComponent implements OnInit {
  @Input() isEditing: boolean;
  @Input() case: ICase;
  @Output() onEditing: EventEmitter<boolean> = new EventEmitter();

  newCase: ICase;
  selectedStatusFilter: IItem;
  caseStatus: ICaseStatus[];
  statusFilter: IItem[];

  constructor(public store: Store<fromStore.State>, public utils: CasesUtilsService) {}

  onEdit() {
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
    this.onEditing.emit(false);
  }

  getCaseStatus() {
    this.store.select(fromStore.getCaseStatus).subscribe((caseStatus: ICaseStatus[]) => {
      this.caseStatus = [...caseStatus];
      this.statusFilter = this.utils.getCaseStatusOptions(this.caseStatus);
      this.selectedStatusFilter = this.statusFilter.filter(
        (item) => this.case.current_status_id == item.action
      )[0];
    });
  }

  onStatusFilter(currentStatus: IItem) {
    this.selectedStatusFilter = currentStatus;
    this.newCase.current_status_id = Number(this.selectedStatusFilter.action);

    this.newCase.current_status = this.caseStatus.filter(
      (item) => item.id == currentStatus.action
    )[0];
  }

  onCancel() {
    this.onEditing.emit(false);
  }

  ngOnInit(): void {
    this.newCase = JSON.parse(JSON.stringify(this.case));
    this.getCaseStatus();
  }
}
