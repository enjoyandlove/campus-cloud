import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take, takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { CPSession } from '@campus-cloud/session';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { CPI18nService } from '@campus-cloud/shared/services';
import { baseActions, getProvidersModalState, baseActionClass } from '@campus-cloud/store/base';
import { EnvService } from '@projects/campus-cloud/src/app/config/env';
import IServiceProvider from '@controlpanel/manage/services/providers.interface';
import { ProvidersService } from '@controlpanel/manage/services/providers.service';
import { HttpParams } from '@angular/common/http';

@Mixin([Destroyable])
@Component({
  selector: 'cp-qr-excel',
  templateUrl: './qr-excel.component.html',
  styleUrls: ['./qr-excel.component.scss']
})
export class QrExcelComponent extends BaseComponent implements OnInit, OnDestroy {
  @Output() checkAll: EventEmitter<boolean> = new EventEmitter();

  providers;
  buttonData;
  loading = false;
  form: FormGroup;
  isFormReady = false;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private env: EnvService,
    private store: Store<any>,
    private session: CPSession,
    private i18nPipe: CPI18nPipe,
    private cpI18n: CPI18nService,
    private providersService: ProvidersService
  ) {
    super();
    super
      .isLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => (this.loading = res));

    this.store
      .select(getProvidersModalState)
      .pipe(take(1))
      .subscribe((providers: IServiceProvider[]) => {
        this.providers = this.env.name !== 'development' ? providers : require('./mock.json');
        this.buildForm();
        this.buildHeader();
      });
  }

  buildHeader() {
    const subheading = this.i18nPipe.transform('qr_import_items_to_import', this.providers.length);

    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: {
        heading: 'qr_import_heading',
        crumbs: {
          url: 'qr',
          label: 'qr_code'
        },
        em: `[NOTRANSLATE]${subheading}[NOTRANSLATE]`,
        children: []
      }
    });
  }

  buildForm() {
    this.form = this.fb.group({
      providers: this.fb.array([])
    });

    setTimeout(() => this.buildGroup());

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.buttonData = Object.assign({}, this.buttonData, {
        disabled: !this.form.valid
      });
    });
  }

  buildGroup() {
    const control = <FormArray>this.form.controls['providers'];

    this.providers.forEach((provider, index) => {
      control.push(this.buildServiceControl(provider));
    });
    this.isFormReady = true;
  }

  removeControl(index) {
    const control = <FormArray>this.form.controls['providers'];
    control.removeAt(index);
  }

  buildServiceControl(provider: IServiceProvider) {
    return this.fb.group({
      school_id: [this.session.g.get('school').id],
      provider_name: [provider.provider_name, Validators.required],
      has_checkout: [provider.has_checkout]
    });
  }

  onSubmit() {
    const search = new HttpParams().append(
      'service_id',
      this.session.g.get('school').ct_service_id
    );

    this.providersService
      .createProvider(this.form.value.providers, search)
      .subscribe((_) => this.router.navigate(['/contact-trace/qr']), () => this.handleError());
  }

  handleError(err?: string) {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: err ? err : this.cpI18n.translate('something_went_wrong')
      })
    );
  }

  ngOnDestroy() {
    this.emitDestroy();
    this.store.dispatch({ type: baseActions.HEADER_DEFAULT });
    this.store.dispatch({ type: baseActions.PROVIDERS_MODAL_RESET });
  }

  ngOnInit() {
    this.buttonData = {
      disabled: true,
      class: 'primary',
      text: this.cpI18n.translate('qr_import_button')
    };
  }
}
