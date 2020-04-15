import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { ClubsService } from '../clubs.service';
import { CPSession } from '@campus-cloud/session';
import { ClubsUtilsService } from '../clubs.utils.service';
import { canSchoolReadResource } from '@campus-cloud/shared/utils';
import { baseActions, baseActionClass } from '@campus-cloud/store/base';
import { ClubsModel } from '@controlpanel/manage/clubs/model/clubs.model';
import { clubAthleticLabels, isClubAthletic } from '../clubs.athletics.labels';
import { CPTrackingService, CPI18nService } from '@campus-cloud/shared/services';
import { amplitudeEvents, CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { ClubsAmplitudeService } from '@controlpanel/manage/clubs/clubs.amplitude.service';

@Component({
  selector: 'cp-clubs-create',
  templateUrl: './clubs-create.component.html',
  styleUrls: ['./clubs-create.component.scss']
})
export class ClubsCreateComponent implements OnInit {
  @Input() isAthletic = isClubAthletic.club;

  labels;
  formError;
  buttonData;
  form: FormGroup;
  statusTypes = this.utils.getStatusTypes();
  membershipTypes = this.utils.getMembershipTypes();

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
    public store: Store<any>,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public utils: ClubsUtilsService,
    public clubsService: ClubsService,
    public cpTracking: CPTrackingService
  ) {}

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

    this.clubsService.createClub(this.form.value, search).subscribe(
      (res: any) => {
        this.trackEvent(res);
        this.cpTracking.amplitudeEmitEvent(
          amplitudeEvents.MANAGE_CREATED_ITEM,
          ClubsAmplitudeService.getItemProperties(res, this.isAthletic)
        );
        this.router.navigate(['/manage/' + this.labels.club_athletic + '/' + res.id + '/info']);
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
      ...this.utils.setEventProperties(data, this.labels.club_athletic)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_CREATED_CLUB, this.eventProperties);
  }

  buildHeader() {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: {
        heading: this.labels.create_button,
        subheading: null,
        em: null,
        children: []
      }
    });
  }

  ngOnInit() {
    this.form = ClubsModel.form(this.isAthletic);
    this.labels = clubAthleticLabels(this.isAthletic);
    this.buildHeader();

    const hasModeration =
      canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.moderation) &&
      canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.membership);

    if (!hasModeration) {
      this.form.get('has_membership').setValue(false);
    }

    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate(this.labels.create_button)
    };
  }
}
