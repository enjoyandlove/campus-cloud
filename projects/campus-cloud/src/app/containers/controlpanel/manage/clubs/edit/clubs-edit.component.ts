import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { ClubsService } from '../clubs.service';
import { CPSession } from '@campus-cloud/session';
import { IHeader, ISnackbar } from '@campus-cloud/store';
import { isClubAthletic } from '../clubs.athletics.labels';
import { ClubsUtilsService } from './../clubs.utils.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { baseActionClass, baseActions } from '@campus-cloud/store/base';
import { ClubsModel } from '@controlpanel/manage/clubs/model/clubs.model';
import { CPTrackingService, CPI18nService } from '@campus-cloud/shared/services';
import { clubAthleticLabels } from '@controlpanel/manage/clubs/clubs.athletics.labels';
import { ClubsAmplitudeService } from '@controlpanel/manage/clubs/clubs.amplitude.service';

@Component({
  selector: 'cp-clubs-edit',
  templateUrl: './clubs-edit.component.html',
  styleUrls: ['./clubs-edit.component.scss']
})
export class ClubsEditComponent extends BaseComponent implements OnInit {
  @Input() isAthletic = isClubAthletic.club;

  club;
  labels;
  clubId;
  isSJSU;
  loading;
  formError;
  buttonData;
  limitedAdmin;
  form: FormGroup;
  isFormReady = false;

  eventProperties = {
    phone: null,
    email: null,
    website: null,
    club_id: null,
    location: null,
    club_type: null,
    club_status: null,
    membership_status: null
  };

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public route: ActivatedRoute,
    public helper: ClubsUtilsService,
    public clubsService: ClubsService,
    public cpTracking: CPTrackingService,
    public store: Store<IHeader | ISnackbar>
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
    this.clubId = this.route.snapshot.params['clubId'];
  }

  fetch() {
    const search = new HttpParams()
      .set('category_id', this.isAthletic.toString())
      .set('school_id', this.session.g.get('school').id.toString());

    const stream$ = this.clubsService.getClubById(this.clubId, search);

    super.fetchData(stream$).then((res) => {
      this.club = res.data;
      this.form = ClubsModel.form(this.isAthletic, this.club, this.limitedAdmin);
      this.isSJSU = ClubsUtilsService.isSJSU(this.club);
      this.isFormReady = true;
    });
  }

  onSubmit() {
    this.formError = false;

    if (this.form.invalid) {
      this.formError = true;
      this.enableSubmitButton();
      this.handleError(this.cpI18n.translate('error_fill_out_marked_fields'));

      return;
    }

    const search = new HttpParams()
      .set('category_id', this.isAthletic.toString())
      .set('school_id', this.session.g.get('school').id.toString());

    this.clubsService.updateClub(this.form.value, this.clubId, search).subscribe(
      (res: any) => {
        this.trackEvent(res);
        this.cpTracking.amplitudeEmitEvent(
          amplitudeEvents.MANAGE_UPDATED_ITEM,
          ClubsAmplitudeService.getItemProperties(res, this.isAthletic)
        );
        this.router.navigate(['/manage/' + this.labels.club_athletic + '/' + res.id + '/info'], {
          queryParams: this.route.snapshot.queryParams
        });
      },
      () => {
        this.enableSubmitButton();
        this.handleError(this.cpI18n.translate('something_went_wrong'));
      }
    );
  }

  handleError(body) {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body
      })
    );
  }

  enableSubmitButton() {
    this.buttonData = {
      ...this.buttonData,
      disabled: false
    };
  }

  trackEvent(data) {
    this.eventProperties = {
      ...this.eventProperties,
      ...this.helper.setEventProperties(data, this.labels.club_athletic)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_UPDATED_CLUB, this.eventProperties);
  }

  buildHeader() {
    this.labels = clubAthleticLabels(this.isAthletic);
    Promise.resolve().then(() => {
      this.store.dispatch({
        type: baseActions.HEADER_UPDATE,
        payload: {
          heading: this.labels.edit_button,
          subheading: null,
          em: null,
          children: []
        }
      });
    });
  }

  ngOnInit() {
    this.limitedAdmin =
      this.isAthletic === isClubAthletic.club
        ? this.helper.limitedAdmin(this.session.g, this.clubId)
        : false;

    this.fetch();
    this.buildHeader();

    this.buttonData = {
      text: this.cpI18n.translate('save'),
      class: 'primary'
    };
  }
}
