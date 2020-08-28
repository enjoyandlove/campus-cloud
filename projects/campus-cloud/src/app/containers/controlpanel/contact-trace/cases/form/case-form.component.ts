import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IItem } from '@campus-cloud/shared/components';
import { CasesUtilsService } from '../cases.utils.service';
import { ICaseStatus } from '../cases.interface';
import { CPSession } from '@campus-cloud/session';
import * as fromStore from '../store';
@Component({
  selector: 'cp-case-form',
  templateUrl: './case-form.component.html',
  styleUrls: ['./case-form.component.scss']
})
export class CaseFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() formErrors;
  @Output() inputChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  caseStatus$: Observable<IItem[]>;
  selectedStatus: ICaseStatus;

  constructor(
    public utils: CasesUtilsService,
    public session: CPSession,
    public store: Store<fromStore.State>
  ) {}

  getCaseStatus() {
    this.caseStatus$ = this.store.select(fromStore.getCaseStatus).pipe(
      map((caseStatus: ICaseStatus[]) => {
        const defaultStatus: ICaseStatus = {
          id: 0,
          name: 'Select Status',
          color: null,
          case_count: null,
          user_list_id: null,
          rank: null
        };
        const responseCopy = [defaultStatus, ...caseStatus];
        return this.utils.getCaseStatusOptions(responseCopy);
      })
    );
  }

  onSelectedStatus(status): void {
    this.form.controls['current_status_id'].setValue(status.action);
  }

  onInputChange(status): void {
    this.inputChanged.emit(true);
  }

  ngOnInit() {
    this.getCaseStatus();
  }
}
