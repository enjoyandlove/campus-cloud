import { Input, OnInit, Output, Component, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store, ActionsSubject } from '@ngrx/store';

import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { CasesUtilsService } from '../cases.utils.service';
import * as fromStore from '../store';
import * as fromRoot from '@campus-cloud/store';
import { ICase } from '../cases.interface';
import { Subject } from 'rxjs';
import { takeUntil, filter, tap } from 'rxjs/operators';
import { baseActionClass } from '@campus-cloud/store';

@Component({
  selector: 'cp-case-create',
  templateUrl: './case-create.component.html',
  styleUrls: ['./case-create.component.scss']
})
export class CaseCreateComponent implements OnInit {
  @ViewChild('createCase', { static: true }) createCase;

  @Input() case: ICase;

  @Output() created: EventEmitter<any> = new EventEmitter();
  @Output() teardown: EventEmitter<null> = new EventEmitter();

  formErrors;
  buttonData;
  errorMessage;
  form: FormGroup;
  isSubmitClicked: boolean = false;

  private destroy$ = new Subject();
  eventProperties = {
    id: null
  };
  constructor(
    public cpI18nPipe: CPI18nPipe,
    public cpTracking: CPTrackingService,
    public utils: CasesUtilsService,
    public store: Store<fromStore.State>,
    private actionsSubject$: ActionsSubject
  ) {}

  onSubmit() {
    this.isSubmitClicked = true;
    this.formErrors = false;
    this.errorMessage = null;

    if (!this.form.valid) {
      this.formErrors = true;
      this.errorMessage = this.cpI18nPipe.transform('error_fill_out_marked_fields');
      this.enableSaveButton();
      return;
    }

    const body = this.form.value;
    const payload = {
      body
    };

    this.store.dispatch(new fromStore.CreateCase(payload));
    this.created.emit(true);
  }

  onValidateFormError() {
    if (this.isSubmitClicked) {
      this.formErrors = false;

      if (!this.form.valid) {
        this.formErrors = true;
        this.enableSaveButton();
      }
    }
  }

  trackEvent(data) {
    this.eventProperties = {
      ...this.eventProperties,
      id: this.case.id.toString()
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.CONTACT_TRACE_CREATED_CASE,
      this.eventProperties
    );
  }

  listenForErrors() {
    this.store
      .select(fromStore.getCasesError)
      .pipe(
        takeUntil(this.destroy$),
        filter((error) => error),
        tap(() => {
          this.store.select(fromStore.getCasesErrorMessage).subscribe();
          this.formErrors = true;
          this.errorMessage = this.cpI18nPipe.transform('case_create_message_exist');
          this.enableSaveButton();
        })
      )
      .subscribe();
  }

  resetModal() {
    this.teardown.emit();
    $('#createCase').modal('hide');
  }

  enableSaveButton() {
    this.buttonData = {
      ...this.buttonData,
      disabled: false
    };
  }

  ngOnInit() {
    this.form = this.utils.getCaseForm(null);
    this.listenForErrors();
    this.buttonData = {
      class: 'primary',
      disabled: false,
      text: this.cpI18nPipe.transform('save')
    };
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
