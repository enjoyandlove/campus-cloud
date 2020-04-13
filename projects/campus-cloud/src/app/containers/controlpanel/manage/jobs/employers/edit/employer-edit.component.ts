import { Component, OnInit, ViewChild, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import * as fromJobs from '@campus-cloud/store/manage/jobs';
import { IJobsState } from '@projects/campus-cloud/src/app/store';
import { READY_MODAL_DATA } from '@ready-education/ready-ui/overlays/modal/modal.service';

@Component({
  selector: 'cp-employer-edit',
  templateUrl: './employer-edit.component.html',
  styleUrls: ['./employer-edit.component.scss']
})
export class EmployerEditComponent implements OnInit, OnDestroy {
  @ViewChild('editForm', { static: true }) editForm;

  disableButton = true;
  employerForm: FormGroup;
  destroy$ = new Subject();

  constructor(
    @Inject(READY_MODAL_DATA) public modal,
    public fb: FormBuilder,
    public updates$: Actions,
    public store: Store<IJobsState>
  ) {}

  resetModal() {
    this.modal.onClose();
  }

  onSubmit() {
    this.disableButton = true;
    this.store.dispatch(new fromJobs.EditEmployer(this.employerForm.value));
  }

  ngOnInit() {
    this.employerForm = this.fb.group({
      id: [this.modal.data.id],
      name: [this.modal.data.name, [Validators.required, Validators.maxLength(120)]],
      description: [this.modal.data.description],
      logo_url: [this.modal.data.logo_url, Validators.required],
      email: [this.modal.data.email]
    });

    this.employerForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.disableButton = !this.employerForm.valid;
    });

    this.updates$
      .pipe(
        ofType(fromJobs.EDIT_EMPLOYER_SUCCESS),
        takeUntil(this.destroy$)
      )
      .subscribe((action: fromJobs.EditEmployerSuccess) => {
        this.modal.onAction(action.payload);
        this.resetModal();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
