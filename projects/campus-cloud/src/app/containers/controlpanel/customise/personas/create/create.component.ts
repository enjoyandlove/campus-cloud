import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { get as _get } from 'lodash';
import { Observable } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { PersonasService } from './../personas.service';
import { LayoutWidth } from '@campus-cloud/layouts/interfaces';
import { baseActions, IHeader } from '@campus-cloud/store/base';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { PersonasUtilsService } from './../personas.utils.service';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { PersonasAmplitudeService } from '../../personas/personas.amplitude.service';
import { PersonasFormComponent } from './../components/personas-form/personas-form.component';
import { PersonasType, PersonasLoginRequired, PersonaValidationErrors } from './../personas.status';

@Component({
  selector: 'cp-personas-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class PersonasCreateComponent implements OnInit {
  @ViewChild('createForm', { static: true }) createForm: PersonasFormComponent;

  services$;
  buttonData;
  form: FormGroup;
  createdPersonaId;
  campusSecurityTile;
  showHomeExperience = true;
  layoutWidth = LayoutWidth.half;
  homeExperience = PersonasUtilsService.getHomeExperience();

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<IHeader>,
    public service: PersonasService,
    public utils: PersonasUtilsService,
    public cpTracking: CPTrackingService
  ) {}

  buildHeader() {
    const payload = {
      heading: 't_personas_create_header_title',
      subheading: null,
      em: null,
      children: []
    };

    Promise.resolve().then(() => {
      this.store.dispatch({
        type: baseActions.HEADER_UPDATE,
        payload
      });
    });
  }

  onSecurityServiceChanged(selection) {
    const serviceMeta = _get(selection, 'meta', null);

    this.campusSecurityTile = serviceMeta;
  }

  trackByFn(_, item) {
    return item.id;
  }

  getCampusLinkForm() {
    const service = this.campusSecurityTile;

    const campusLinkForm = this.utils.getCampusLinkForm();

    campusLinkForm.controls['name'].setValue(service.name);
    campusLinkForm.controls['img_url'].setValue(service.img_url);

    const link_params = <FormGroup>campusLinkForm.controls['link_params'];
    link_params.controls['id'].setValue(service.id);

    return campusLinkForm.value;
  }

  createCampusTile(campusLinkId, personaId): Observable<any> {
    const service = this.campusSecurityTile;

    const guideTileForm = this.utils.getGuideTileForm();

    guideTileForm.controls['name'].setValue(service.name);

    const extra_info = <FormGroup>guideTileForm.controls['extra_info'];
    extra_info.controls['id'].setValue(campusLinkId);

    const data = {
      ...guideTileForm.value,
      school_persona_id: personaId
    };

    return this.service.createGuideTile(data);
  }

  createSecurityTile(personaId): Observable<any> {
    const campusLinkForm = this.getCampusLinkForm();
    const createCampusLink$ = this.service.createCampusLink(campusLinkForm);

    return createCampusLink$.pipe(
      switchMap((link: any) => this.createCampusTile(link.id, personaId))
    );
  }

  togglePersona(value, name) {
    this.form.get(name).setValue(value);
  }

  onSubmit() {
    const formData = this.createForm.form.value;
    const body = this.utils.parseLocalFormToApi(formData);
    const createPersona$ = this.service.createPersona(body);

    const stream$ = this.campusSecurityTile
      ? createPersona$.pipe(
          map(({ id }: any) => {
            this.createdPersonaId = id;

            return id;
          }),
          switchMap((id) => this.createSecurityTile(id))
        )
      : createPersona$.pipe(map(({ id }: any) => (this.createdPersonaId = id)));

    stream$.subscribe(
      () => {
        this.trackCreateExperienceEvent(formData, this.campusSecurityTile, this.createdPersonaId);
        this.router.navigate([`/studio/experiences/${this.createdPersonaId}`]);
      },
      (err) => {
        this.buttonData = { ...this.buttonData, disabled: false };

        const error = JSON.parse(err._body).error;
        let message = this.cpI18n.translate('something_went_wrong');

        if (error === PersonaValidationErrors.api_env) {
          message = this.cpI18n.translate('t_personas_create_error_api_env');
        } else if (error === PersonaValidationErrors.customization_off) {
          message = this.cpI18n.translate('t_personas_create_error_customization off');
        }

        this.store.dispatch({
          type: baseActions.SNACKBAR_SHOW,
          payload: {
            sticky: true,
            class: 'danger',
            body: message
          }
        });
      }
    );
  }

  onFormValueChanges(form: FormGroup) {
    this.buttonData = { ...this.buttonData, disabled: !form.valid };

    this.showHomeExperience =
      form.value.platform !== PersonasType.web &&
      form.value.login_requirement !== PersonasLoginRequired.forbidden;
  }

  buildForm() {
    this.form = this.utils.getPersonasForm();
  }

  loadServices() {
    const search = new HttpParams().set('school_id', this.session.g.get('school').id);

    this.services$ = this.service.getServices(search);
  }

  trackCreateExperienceEvent(data, isSecurityService, personaId) {
    const eventProperties = PersonasAmplitudeService.getExperienceAmplitudeProperties(
      data,
      isSecurityService,
      personaId
    );

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.STUDIO_CREATED_EXPERIENCE, eventProperties);
  }

  ngOnInit(): void {
    this.buildForm();
    this.buildHeader();
    this.loadServices();

    this.buttonData = {
      class: 'primary',
      disabled: true,
      text: this.cpI18n.translate('save')
    };
  }
}
