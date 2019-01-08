import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Actions } from '@ngrx/effects';
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

import { CPSession } from '@app/session';
import { IJobsState } from '@client/app/store';
import { IEmployer } from '../employer.interface';
import * as fromJobs from '@app/store/manage/jobs';
import { CPI18nService } from '@shared/services/i18n.service';

@Component({
  selector: 'cp-employer-create',
  templateUrl: './employer-create.component.html',
  styleUrls: ['./employer-create.component.scss']
})
export class EmployerCreateComponent implements OnInit, OnDestroy {
  @ViewChild('createForm') createForm;

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
      .ofType(fromJobs.CREATE_EMPLOYER_SUCCESS)
      .pipe(takeUntil(this.destroy$))
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
