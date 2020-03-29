import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { DealsService } from '../deals.service';
import { CPSession } from '@campus-cloud/session';
import { dealDateValidator } from '../deals.utils';
import { DealsStoreService } from '../stores/store.service';
import { baseActions, IHeader } from '@campus-cloud/store/base';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CustomValidators } from '@campus-cloud/shared/validators';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { DealsAmplitudeService } from '@controlpanel/manage/deals/deals.amplitude.service';

@Component({
  selector: 'cp-deals-create',
  templateUrl: './deals-create.component.html',
  styleUrls: ['./deals-create.component.scss']
})
export class DealsCreateComponent implements OnInit {
  data;
  error = false;
  buttonData;
  isNewStore;
  errorMessage;
  form: FormGroup;
  storeForm: FormGroup;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public service: DealsService,
    public store: Store<IHeader>,
    public cpI18n: CPI18nService,
    private cpTracking: CPTrackingService,
    public storeService: DealsStoreService
  ) {}

  onSubmit() {
    this.error = false;

    if (this.isNewStore) {
      this.createDealWithNewStore(this.data);
    } else {
      this.createDeal(this.data);
    }
  }

  createDeal(data) {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);

    this.service.createDeal(data.deal, search).subscribe(
      (deal: any) => {
        this.cpTracking.amplitudeEmitEvent(
          amplitudeEvents.MANAGE_CREATED_ITEM,
          DealsAmplitudeService.getItemProperties()
        );
        this.router.navigate([`/manage/deals/${deal.id}/info`]);
      },
      (_) => {
        this.error = true;
        this.errorMessage = this.cpI18n.translate('something_went_wrong');
      }
    );
  }

  createDealWithNewStore(data) {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);

    this.storeService
      .createStore(data.store, search)
      .pipe(
        switchMap((store: any) => {
          data.deal.store_id = store.id;

          return this.service.createDeal(data.deal, search);
        })
      )
      .subscribe(
        (deal: any) => this.router.navigate([`/manage/deals/${deal.id}/info`]),
        (_) => {
          this.error = true;
          this.errorMessage = this.cpI18n.translate('something_went_wrong');
        }
      );
  }

  buildHeader() {
    Promise.resolve().then(() => {
      this.store.dispatch({
        type: baseActions.HEADER_UPDATE,
        payload: {
          heading: `t_deals_form_heading_create_deal`,
          subheading: null,
          em: null,
          children: []
        }
      });
    });
  }

  buildStoreForm() {
    this.storeForm = this.fb.group({
      name: [null],
      city: [null],
      province: [null],
      country: [null],
      postal_code: [null],
      website: [null],
      address: [null],
      logo_url: [null],
      description: [null],
      latitude: [0],
      longitude: [0]
    });
  }

  onFormData(data) {
    this.data = data;
    const isFormValid = data.dealFormValid && data.storeFormValid;
    this.buttonData = { ...this.buttonData, disabled: !isFormValid };
  }

  onToggleStore(value) {
    this.isNewStore = value;
  }

  buildDealsForm() {
    this.form = this.fb.group(
      {
        title: [
          null,
          Validators.compose([
            Validators.required,
            Validators.maxLength(120),
            CustomValidators.requiredNonEmpty
          ])
        ],
        store_id: [null, Validators.required],
        image_url: [null, Validators.required],
        image_thumb_url: [null],
        description: [null],
        start: [null, Validators.required],
        expiration: [null],
        ongoing: [false]
      },
      { validator: dealDateValidator(this.session.tz) }
    );
  }

  ngOnInit() {
    this.buildHeader();
    this.buildDealsForm();
    this.buildStoreForm();

    this.buttonData = {
      disabled: true,
      class: 'primary',
      text: this.cpI18n.translate('save')
    };
  }
}
