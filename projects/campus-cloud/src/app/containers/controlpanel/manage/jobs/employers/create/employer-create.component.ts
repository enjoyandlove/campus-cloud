import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import {
  OnInit,
  Output,
  Component,
  ViewChild,
  OnDestroy,
  ElementRef,
  EventEmitter,
  HostListener
} from '@angular/core';

import { CPSession } from '@campus-cloud/session';
import { IJobsState } from '@projects/campus-cloud/src/app/store';
import { IEmployer } from '../employer.interface';
import * as fromJobs from '@campus-cloud/store/manage/jobs';
import { CPI18nService } from '@campus-cloud/shared/services/i18n.service';

@Component({
  selector: 'cp-employer-create',
  templateUrl: './employer-create.component.html',
  styleUrls: ['./employer-create.component.scss']
})
export class EmployerCreateComponent implements OnInit, OnDestroy {
  @ViewChild('createForm', { static: true }) createForm;

  @Output() created: EventEmitter<IEmployer> = new EventEmitter();
  @Output() resetCreateModal: EventEmitter<null> = new EventEmitter();

  buttonData;
  employerForm: FormGroup;
  destroy$ = new Subject();

  constructor(
    public el: ElementRef,
    public fb: FormBuilder,
    public updates$: Actions,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<IJobsState>
  ) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal reset form
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  resetModal() {
    this.resetCreateModal.emit();
    this.createForm.employerForm.reset();
    $('#createModal').modal('hide');
  }

  onSubmit() {
    this.store.dispatch(new fromJobs.CreateEmployer(this.employerForm.value));
  }

  ngOnInit() {
    this.employerForm = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(120)]],
      description: [null],
      logo_url: [null, Validators.required],
      email: [null]
    });

    this.buttonData = Object.assign({}, this.buttonData, {
      class: 'primary',
      disabled: true,
      text: this.cpI18n.translate('save')
    });

    this.employerForm.valueChanges.subscribe(() => {
      this.buttonData = { ...this.buttonData, disabled: !this.employerForm.valid };
    });

    this.updates$
      .pipe(
        ofType(fromJobs.CREATE_EMPLOYER_SUCCESS),
        takeUntil(this.destroy$)
      )
      .subscribe((action: fromJobs.CreateEmployerSuccess) => {
        this.created.emit(action.payload);
        this.resetModal();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
