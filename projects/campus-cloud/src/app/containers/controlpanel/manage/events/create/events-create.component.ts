import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';

import { EventsService } from '../events.service';
import { CPSession } from '@campus-cloud/session';
import { baseActions } from '@campus-cloud/store/base';
import { EventUtilService } from '../events.utils.service';
import { EventsComponent } from '../list/base/events.component';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import IEvent from '@controlpanel/manage/events/event.interface';
import { EventsAmplitudeService } from '../events.amplitude.service';
import { EventsModel } from '@controlpanel/manage/events/model/events.model';
import { ModalService, CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-events-create',
  templateUrl: './events-create.component.html',
  styleUrls: ['./events-create.component.scss']
})
export class EventsCreateComponent extends EventsComponent implements OnInit {
  @Input() storeId: number;
  @Input() isClub: boolean;
  @Input() clubId: number;
  @Input() serviceId: number;
  @Input() isAthletic: boolean;
  @Input() isService: boolean;
  @Input() orientationId: number;
  @Input() isOrientation: boolean;

  urlPrefix;
  buttonData;
  form: FormGroup;
  formError = false;
  addedHost = amplitudeEvents.NO;

  eventProperties = {
    event_id: null,
    location: null,
    feedback: null,
    host_type: null,
    description: null,
    qr_code_status: null,
    assessment_status: null
  };

  changedHost$: BehaviorSubject<number> = new BehaviorSubject(null);

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public storeHeader: Store<any>,
    public service: EventsService,
    public utils: EventUtilService,
    public modalService: ModalService,
    public cpTracking: CPTrackingService
  ) {
    super(session, cpI18n, service, modalService, storeHeader);
  }

  buildHeader() {
    const payload = {
      heading: 'events_create_heading',
      subheading: null,
      em: null,
      children: []
    };

    this.storeHeader.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload
    });
  }

  onSubmit() {
    this.formError = false;
    this.utils.clearDateErrors(this.form);

    if (this.form.invalid) {
      this.formError = true;
      this.enableSaveButton();
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

    this.service.createEvent(this.form.value, search).subscribe(
      (res: any) => {
        this.trackCreateEvent(res);
        this.urlPrefix = this.getUrlPrefix(res.id);
        this.router.navigate([this.urlPrefix]);
      },
      () => {
        this.enableSaveButton();
        this.handleError();
      }
    );
  }

  getUrlPrefix(event_id) {
    const eventType = {
      ...this.getEventType(),
      event_id
    };

    return this.utils.buildUrlPrefixEvents(eventType);
  }

  trackCreateEvent(event: IEvent) {
    this.eventProperties = {
      ...this.eventProperties,
      ...EventsAmplitudeService.getEventProperties(event),
      event_id: event.id
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_CREATED_EVENT, this.eventProperties);
  }

  trackCancelEvent() {
    const event = this.form.value;

    const eventProperties = {
      ...EventsAmplitudeService.getEventProperties(event),
      added_host: this.addedHost,
      added_date: EventsAmplitudeService.getDateStatus(event),
      uploaded_image: EventsAmplitudeService.getPropertyStatus(event.poster_url)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_CANCELED_EVENT, eventProperties);
  }

  enableSaveButton() {
    this.buttonData = {
      ...this.buttonData,
      disabled: false
    };
  }

  onSelectProperties(properties) {
    this.eventProperties = {
      ...this.eventProperties,
      ...properties
    };
  }

  onHostSelect(host) {
    this.addedHost = amplitudeEvents.YES;

    this.changedHost$.next(host);
  }

  ngOnInit() {
    this.buildHeader();
    const host_type = this.session.defaultHost ? this.session.defaultHost.hostType : null;

    this.eventProperties = {
      ...this.eventProperties,
      host_type
    };

    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('events_button_new')
    };

    let store_id = this.session.defaultHost ? this.session.defaultHost.value : null;

    if (this.storeId) {
      store_id = this.storeId;
    } else if (this.clubId) {
      store_id = this.clubId;
    }

    this.form = EventsModel.form(this.isOrientation);
    this.form.get('store_id').setValue(store_id);
  }
}
