import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, take, takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, Observable } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { EnvService } from '@campus-cloud/config/env';
import { CPI18nPipe } from '@campus-cloud/shared/pipes/i18n/i18n.pipe';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { baseActions, baseActionClass, getCasesModalState } from '@campus-cloud/store/base';
import { CasesService } from '../cases.service';
import { CasesUtilsService } from '../cases.utils.service';
import { IItem } from '@campus-cloud/shared/components';
import { ICaseStatus } from '../cases.interface';
import * as fromStore from '../store';
@Mixin([Destroyable])
@Component({
  selector: 'cp-cases-excel',
  templateUrl: './cases-excel.component.html',
  styleUrls: ['./cases-excel.component.scss']
})
export class CasesExcelComponent extends BaseComponent implements OnInit, OnDestroy {
  cases;
  buttonData;
  isChecked = [];
  loading = false;
  form: FormGroup;
  isFormReady = false;
  selectedStatus: IItem[] = [];
  isParentCheckBoxChecked = false;
  statusDropDownStatus = true;
  caseStatus$: Observable<IItem[]>;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private env: EnvService,
    private store: Store<fromStore.ICasesState>,
    private session: CPSession,
    private cpI18nPipe: CPI18nPipe,
    private casesService: CasesService,
    public utils: CasesUtilsService
  ) {
    super();
    super
      .isLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => (this.loading = res));

    this.store
      .select(getCasesModalState)
      .pipe(take(1))
      .subscribe((res) => {
        this.cases = this.env.name !== 'development' ? res : require('./mock.json');

        this.getCaseStatus();
        this.buildForm();
        this.buildHeader();
      });
  }

  getCaseStatus() {
    this.caseStatus$ = this.store.select(fromStore.getCaseStatus).pipe(
      map((caseStatus: ICaseStatus[]) => {
        const responseCopy = [...caseStatus];
        return this.utils.getCaseStatusOptions(responseCopy);
      })
    );
  }

  buildHeader() {
    const subheading = this.cpI18nPipe.transform('cases_import_items_to_import', this.cases.length);

    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: {
        heading: 'import_cases',
        crumbs: {
          url: 'cases',
          label: 'cases'
        },
        em: `[NOTRANSLATE]${subheading}[NOTRANSLATE]`,
        children: []
      }
    });
  }

  buildForm() {
    this.form = this.fb.group({
      cases: this.fb.array([])
    });

    this.buildGroup();
  }

  buildGroup() {
    const control = <FormArray>this.form.controls['cases'];

    this.cases.forEach((item, index) => {
      control.push(this.buildCaseControl(item));
      this.isChecked.push({ index, checked: false });
    });

    this.isFormReady = true;
  }

  removeControl(index) {
    const control = <FormArray>this.form.controls['cases'];
    control.removeAt(index);
  }

  buildCaseControl(item) {
    let current_form;

    this.caseStatus$.subscribe((statuses) => {
      const current_status = statuses.filter((el) => el.action == item.current_status_id);

      this.selectedStatus.push(current_status[0]);
      current_form = this.fb.group({
        firstname: [item.firstname, Validators.required],
        lastname: [item.lastname, Validators.required],
        current_status_id: [current_status[0].action, Validators.required],
        extern_user_id: [item.extern_user_id]
      });
    });

    return current_form;
  }

  onBulkChange(actions) {
    const control = <FormArray>this.form.controls['cases'];
    this.isChecked.map((item) => {
      if (item.checked) {
        const ctrl = <FormGroup>control.controls[item.index];

        Object.keys(actions).forEach((key) => {
          if (key === 'status') {
            this.selectedStatus[item.index] = actions[key];
            ctrl.controls['current_status_id'].setValue(actions[key].action);
          }
        });
      }
    });
    this.enableSubmitButton();
  }

  onSingleStatusSelected(status, index) {
    const controls = <FormArray>this.form.controls['cases'];
    const control = <FormGroup>controls.controls[index];

    control.controls['current_status_id'].setValue(status.action);

    this.enableSubmitButton();
  }

  enableSubmitButton() {
    let isValid = false;

    if (this.isChecked.length > 0) {
      isValid = this.form.controls.cases['controls'].reduce((prev, item, index) => {
        let valid = true;
        if (this.isChecked[index].checked) {
          valid = item.status === 'VALID' ? true : false;
        }
        return valid && prev;
      }, true);
    }

    this.buttonData = Object.assign({}, this.buttonData, {
      disabled: !isValid
    });
  }

  onSingleCheck(checked, index) {
    let _isChecked;

    _isChecked = this.isChecked.map((item) => {
      if (item.index === index) {
        item = Object.assign({}, item, { checked: checked });
      }

      return item;
    });

    const getOnlyChecked = _isChecked.filter((item) => item.checked);
    const isParentChecked = _isChecked.length === getOnlyChecked.length;
    const totalChecked = getOnlyChecked.length > 0;

    this.isChecked = [..._isChecked];
    this.updateTopHeaderButtonsStatus(totalChecked);
    this.updateParentCheckBoxStatus(isParentChecked);

    this.enableSubmitButton();
  }

  onCheckAll(checked) {
    const _isChecked = [];

    this.isChecked.map((item) => {
      _isChecked.push(Object.assign({}, item, { checked: checked }));
    });

    this.isChecked = [..._isChecked];
    this.updateTopHeaderButtonsStatus(checked);

    this.enableSubmitButton();
  }

  onStatusBulkChange(status) {
    this.onBulkChange({ status });
  }

  onSubmit() {
    const params = new HttpParams().set('school_id', this.session.g.get('school').id);

    const data = this.form.value.cases.filter((item, i) => {
      return this.isChecked.some((el) => el.checked && el.index === i);
    });

    this.store.dispatch(new fromStore.ImportCases(''));

    this.casesService
      .createCase(data, params)
      .subscribe((_) => this.router.navigate(['/contact-trace/cases']), () => this.handleError());
  }

  handleError(err?: string) {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: err ? err : this.cpI18nPipe.transform('something_went_wrong')
      })
    );
  }

  resetAllCheckboxes(checked, index) {
    this.onCheckAll(false);
    this.onSingleCheck(checked, index);
  }

  updateTopHeaderButtonsStatus(checked) {
    this.statusDropDownStatus = !checked;
    this.isParentCheckBoxChecked = checked;
  }

  updateParentCheckBoxStatus(checked) {
    this.isParentCheckBoxChecked = checked;
  }

  ngOnDestroy() {
    this.emitDestroy();
    this.store.dispatch({ type: baseActions.HEADER_DEFAULT });
    this.store.dispatch({ type: baseActions.SERVICES_MODAL_RESET });
  }

  ngOnInit() {
    this.buttonData = {
      disabled: true,
      class: 'primary',
      text: this.cpI18nPipe.transform('import_cases')
    };
  }
}
