import { OnInit, Inject, Component, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import * as fromJobs from '@campus-cloud/store/manage/jobs';
import { IJobsState } from '@campus-cloud/store';
import { READY_MODAL_DATA } from '@ready-education/ready-ui/overlays/modal/modal.service';

@Component({
  selector: 'cp-employer-create',
  templateUrl: './employer-create.component.html',
  styleUrls: ['./employer-create.component.scss']
})
export class EmployerCreateComponent implements OnInit, OnDestroy {
  @ViewChild('createForm', { static: true }) createForm;

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
    this.store.dispatch(new fromJobs.CreateEmployer(this.employerForm.value));
  }

  ngOnInit() {
    this.employerForm = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(120)]],
      description: [null],
      logo_url: [null, Validators.required],
      email: [null]
    });

    this.employerForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.disableButton = !this.employerForm.valid;
    });

    this.updates$
      .pipe(
        ofType(fromJobs.CREATE_EMPLOYER_SUCCESS),
        takeUntil(this.destroy$)
      )
      .subscribe((action: fromJobs.CreateEmployerSuccess) => {
        this.modal.onAction(action.payload);
        this.resetModal();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
