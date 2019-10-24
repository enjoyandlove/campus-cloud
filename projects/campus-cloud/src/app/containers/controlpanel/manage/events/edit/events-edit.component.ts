import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';

import IEvent from '../event.interface';
import { EventsService } from '../events.service';
import { CPSession } from '@campus-cloud/session';
import { EventsModel } from '../model/events.model';
import { EventUtilService } from '../events.utils.service';
import { baseActions, IHeader } from '@campus-cloud/store/base';
import { EventsComponent } from '../list/base/events.component';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { EventsAmplitudeService } from '../events.amplitude.service';
import {
  RouteLevel,
  ModalService,
  CPI18nService,
  CPTrackingService
} from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-events-edit',
  templateUrl: './events-edit.component.html',
  styleUrls: ['./events-edit.component.scss']
})
export class EventsEditComponent extends EventsComponent implements OnInit {
  @Input() storeId: number;
  @Input() isClub: boolean;
  @Input() clubId: number;
  @Input() isService: boolean;
  @Input() isAthletic: boolean;
  @Input() athleticId: number;
  @Input() orientationId: number;
  @Input() isOrientation: boolean;

  urlPrefix;
  formError;
  buttonData;
  loading = true;
  eventId: number;
  form: FormGroup;
  isFormReady = false;
  changedHost$: BehaviorSubject<number> = new BehaviorSubject(null);

  eventProperties = {
    event_id: null,
    feedback: null,
    host_type: null,
    qr_code_status: null,
    creation_source: null,
    assessment_status: null,
    updated_description: null,
    updated_image: amplitudeEvents.NO,
    updated_location: amplitudeEvents.NO_CHANGES
  };

  constructor(
    public router: Router,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<IHeader>,
    private route: ActivatedRoute,
    public service: EventsService,
    public utils: EventUtilService,
    public modalService: ModalService,
    public cpTracking: CPTrackingService
  ) {
    super(session, cpI18n, service, modalService, store);
    this.eventId = this.route.snapshot.params['eventId'];

    super.isLoading().subscribe((res) => (this.loading = res));
  }

  onSubmit() {
    this.formError = false;
    this.utils.clearDateErrors(this.form);

    if (this.form.invalid) {
      this.enableSaveButton();
      this.formError = true;
      this.handleError(this.cpI18n.translate('error_fill_out_marked_fields'));

      return;
    }

    if (this.form.controls['is_all_day'].value) {
      this.utils.updateTime(this.form);
    }

    if (this.utils.setEventFormDateErrors(this.form)) {
      this.formError = true;
      this.enableSaveButton();
      const errorMessage = this.utils.setEventFormDateErrors(this.form);

      this.handleError(errorMessage);

      return;
    }

    let search = new HttpParams();
    if (this.orientationId) {
      search = search
        .set('school_id', this.session.g.get('school').id)
        .set('calendar_id', this.orientationId.toString());
    }

    this.service.updateEvent(this.form.value, this.eventId, search).subscribe(
      (event: IEvent) => {
        this.trackQrCode(event);
        this.trackEditEvent(event);

        this.router.navigate([this.urlPrefix]);
      },
      () => {
        this.handleError();
        this.enableSaveButton();
      }
    );
  }

  enableSaveButton() {
    this.buttonData = {
      ...this.buttonData,
      disabled: false
    };
  }

  public fetch() {
    const school = this.session.g.get('school');
    const orientationId = this.orientationId ? this.orientationId.toString() : null;
    const search: HttpParams = new HttpParams()
      .set('school_id', school.id.toString())
      .set('calendar_id', orientationId);

    const event$ = this.service.getEventById(this.eventId, search);

    super
      .fetchData(event$)
      .then((res) => {
        this.form = EventsModel.form(this.isOrientation, res.data);
        this.isFormReady = true;
      })
      .catch(() => this.handleError());
  }

  public buildHeader() {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: {
        heading: 'events_edit_event',
        subheading: '',
        children: []
      }
    });
  }

  trackQrCode(event: IEvent) {
    const eventProperties = {
      ...EventsAmplitudeService.getQRCodeCheckOutStatus(event, true),
      source_id: event.encrypted_id,
      sub_menu_name: this.cpTracking.activatedRoute(RouteLevel.second),
      assessment_type: EventsAmplitudeService.getEventCategoryType(event.store_category)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_CHANGED_QR_CODE, eventProperties);
  }

  trackEditEvent(event: IEvent) {
    const description = this.form.get('description');

    this.eventProperties = {
      ...this.eventProperties,
      ...EventsAmplitudeService.getEventProperties(event, true),
      event_id: this.eventId,
      creation_source: EventsAmplitudeService.getEventType(event.is_external),
      updated_description: EventsAmplitudeService.getEventDescriptionStatus(description)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_UPDATED_EVENT, this.eventProperties);
  }

  onSelectProperties(properties) {
    this.eventProperties = {
      ...this.eventProperties,
      ...properties
    };
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('save'),
      class: 'primary'
    };

    const eventType = {
      ...this.getEventType(),
      event_id: this.eventId
    };

    this.urlPrefix = this.utils.buildUrlPrefixEvents(eventType);

    this.fetch();
    this.buildHeader();
  }
}
