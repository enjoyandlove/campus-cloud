import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { EnvService } from '@campus-cloud/config/env';
import { Store } from '@ngrx/store';
import { CPSession } from '@campus-cloud/session';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { CPI18nService, ImageService } from '@campus-cloud/shared/services';
import { take, takeUntil } from 'rxjs/operators';
import { baseActionClass, baseActions, getProvidersModalState } from '@campus-cloud/store';
import { BaseComponent } from '@campus-cloud/base';
import { ProvidersService } from '@controlpanel/manage/services/providers.service';
import IServiceProvider from '@controlpanel/manage/services/providers.interface';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'cp-providers-excel',
  templateUrl: './providers-excel.component.html',
  styleUrls: ['./providers-excel.component.scss']
})
export class ServicesProvidersExcelComponent extends BaseComponent implements OnInit, OnDestroy {
  providers;
  buttonData;
  loading = false;
  form: FormGroup;
  isFormReady = false;
  serviceId: number;

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
    private imageService: ImageService,
    private providersService: ProvidersService,
    public route: ActivatedRoute
  ) {
    super();
    this.serviceId = this.route.snapshot.params['serviceId'];
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
    const subheading = this.i18nPipe.transform(
      'service_providers_import_items_to_import',
      this.providers.length
    );

    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: {
        heading: 'service_providers_import',
        crumbs: {
          url: `services/${this.serviceId}`,
          label: 'service_providers'
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

    this.providers.forEach((service, index) => {
      control.push(this.buildServiceControl(service));
    });

    this.isFormReady = true;
  }

  removeControl(index) {
    const control = <FormArray>this.form.controls['providers'];
    control.removeAt(index);
  }

  buildServiceControl(serviceProvider: IServiceProvider) {
    return this.fb.group({
      school_id: [this.session.g.get('school').id],
      provider_name: [serviceProvider.provider_name, Validators.required],
      email: [serviceProvider.email, Validators.required]
    });
  }

  onSubmit() {
    const search = new HttpParams().append('service_id', this.serviceId.toString());
    this.providersService
      .createProvider(this.form.value.providers, search)
      .subscribe(
        (_) => this.router.navigate([`/manage/services/${this.serviceId}`]),
        () => this.handleError()
      );
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
      text: this.cpI18n.translate('service_providers_import')
    };
  }
}
