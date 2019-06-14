import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
  OnDestroy
} from '@angular/core';

import { CPSession } from '@app/session';
import { IJobsState } from '@campus-cloud/src/app/store';
import { IEmployer } from '../employer.interface';
import * as fromJobs from '@app/store/manage/jobs';
import { CPI18nService } from '@shared/services/i18n.service';

@Component({
  selector: 'cp-employer-edit',
  templateUrl: './employer-edit.component.html',
  styleUrls: ['./employer-edit.component.scss']
})
export class EmployerEditComponent implements OnInit, OnDestroy {
  @ViewChild('editForm', { static: true }) editForm;

  @Input() employer: IEmployer;

  @Output() edited: EventEmitter<IEmployer> = new EventEmitter();
  @Output() resetEditModal: EventEmitter<null> = new EventEmitter();

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
    this.resetEditModal.emit();
    this.editForm.employerForm.reset();
    $('#editModal').modal('hide');
  }

  onSubmit() {
    this.store.dispatch(new fromJobs.EditEmployer(this.employerForm.value));
  }

  ngOnInit() {
    this.employerForm = this.fb.group({
      id: [this.employer.id],
      name: [this.employer.name, [Validators.required, Validators.maxLength(120)]],
      description: [this.employer.description],
      logo_url: [this.employer.logo_url, Validators.required],
      email: [this.employer.email]
    });

    this.buttonData = Object.assign({}, this.buttonData, {
      class: 'primary',
      disabled: false,
      text: this.cpI18n.translate('save')
    });

    this.employerForm.valueChanges.subscribe(() => {
      this.buttonData = { ...this.buttonData, disabled: !this.employerForm.valid };
    });

    this.updates$
      .pipe(
        ofType(fromJobs.EDIT_EMPLOYER_SUCCESS),
        takeUntil(this.destroy$)
      )
      .subscribe((action: fromJobs.EditEmployerSuccess) => {
        this.edited.emit(action.payload);
        this.resetModal();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
