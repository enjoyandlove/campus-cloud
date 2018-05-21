import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { DealsService } from '../deals.service';
import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base';
import { CPDate } from '../../../../../shared/utils';
import { StoreService } from '../stores/store.service';
import { CPI18nService } from '../../../../../shared/services';
import { SNACKBAR_SHOW } from '../../../../../reducers/snackbar.reducer';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-deals-edit',
  templateUrl: './deals-edit.component.html',
  styleUrls: ['./deals-edit.component.scss']
})
export class DealsEditComponent extends BaseComponent implements OnInit {
  data;
  deal;
  dealId;
  loading;
  formError;
  buttonData;
  isNewStore;
  form: FormGroup;
  dateErrorMessage;
  storeForm: FormGroup;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public service: DealsService,
    public store: Store<IHeader>,
    public cpI18n: CPI18nService,
    public route: ActivatedRoute,
    public storeService: StoreService
  ) {
    super();
    this.dealId = this.route.snapshot.params['dealId'];
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  public fetch() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);

    super.fetchData(this.service.getDealById(this.dealId, search)).then((deal) => {
      this.buildForm(deal.data);
    });
  }

  onSubmit() {
    this.formError = false;

    if (this.data.deal.expiration <= this.data.deal.start) {
      this.formError = true;
      this.dateErrorMessage = this.cpI18n.translate('t_deals_form_error_end_date_before_start');

      return;
    }

    if (this.data.deal.expiration <= Math.round(CPDate.now(this.session.tz).unix())) {
      this.formError = true;
      this.dateErrorMessage = this.cpI18n.translate('t_deals_form_error_end_date_after_now');

      return;
    }

    if (this.isNewStore) {
      this.editDealWithNewStore(this.data);
    } else {
      this.editDeal(this.data);
    }
  }

  editDeal(data) {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);

    this.service
      .editDeal(this.dealId, data.deal, search)
      .subscribe((deal) => this.router.navigate([`/manage/deals/${deal.id}/info`]));
  }

  editDealWithNewStore(data) {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);

    this.storeService
      .createStore(data.store, search)
      .switchMap((store) => {
        data.deal.store_id = store.id;

        return this.service.editDeal(this.dealId, data.deal, search);
      })
      .subscribe(
        (deal) => this.router.navigate([`/manage/deals/${deal.id}/info`]),
        (_) => this.flashMessageError()
      );
  }

  flashMessageError() {
    this.store.dispatch({
      type: SNACKBAR_SHOW,
      payload: {
        class: 'danger',
        autoClose: true,
        body: this.cpI18n.translate('something_went_wrong')
      }
    });
  }

  buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        heading: `t_deals_form_heading_create_deal`,
        subheading: null,
        em: null,
        children: []
      }
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
      latitude: [null],
      longitude: [null],
      logo_url: [null],
      description: [null]
    });
  }

  formData(data) {
    this.data = data;
    const isFormValid = data.dealFormValid && data.storeFormValid;
    this.buttonData = Object.assign({}, this.buttonData, { disabled: !isFormValid });
  }

  onToggleStore(value) {
    this.isNewStore = value;
  }

  buildForm(data) {
    this.form = this.fb.group({
      title: [data.title, [Validators.required, Validators.maxLength(120)]],
      store_id: [data.store_id, Validators.required],
      image_url: [data.image_url, Validators.required],
      image_thumb_url: [data.image_thumb_url],
      description: [data.description],
      start: [data.start, Validators.required],
      expiration: [data.expiration, Validators.required],
    });
  }

  ngOnInit() {
    this.fetch();
    this.buildHeader();
    this.buildStoreForm();

    this.buttonData = {
      disabled: true,
      class: 'primary',
      text: this.cpI18n.translate('save')
    };
  }
}
