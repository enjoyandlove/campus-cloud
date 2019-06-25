import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { get as _get } from 'lodash';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { IPersona } from '../persona.interface';
import { ITile } from '../tiles/tile.interface';
import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base';
import { PersonasService } from './../personas.service';
import { TileVisibility } from './../tiles/tiles.status';
import { CampusLink } from './../../../manage/links/tile';
import { PersonaValidationErrors } from './../personas.status';
import { PersonasUtilsService } from './../personas.utils.service';
import { baseActions, IHeader } from './../../../../../store/base';
import { credentialType, PersonasType } from '../personas.status';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';
import { CPI18nService, CPTrackingService } from '../../../../../shared/services';
import { PersonasFormComponent } from './../components/personas-form/personas-form.component';

@Component({
  selector: 'cp-personas-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class PersonasEditComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('editForm', { static: false }) editForm: PersonasFormComponent;

  services$;
  form: FormGroup;
  submitButtonData;
  loading: boolean;
  persona: IPersona;
  personaId: number;
  originalSecurityService;
  selectedSecurityService;
  securityTileChanged = false;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<IHeader>,
    public route: ActivatedRoute,
    public service: PersonasService,
    public utils: PersonasUtilsService,
    public cpTracking: CPTrackingService
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));
    this.personaId = this.route.snapshot.params['personaId'];
  }

  buildHeader() {
    const payload = {
      heading: 't_personas_edit_header_title',
      subheading: null,
      em: null,
      children: []
    };

    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload
    });
  }

  deleteCampusSecurityTile() {
    const search = new HttpParams().set('school_id', this.session.g.get('school').id);

    return this.service.deleteTileById(this.originalSecurityService.id, search).toPromise();
  }

  onSecurityServiceChanged(selection) {
    const campusSecurityServiceId = this.utils.getCampusSecurityServiceId(
      this.originalSecurityService
    );

    this.securityTileChanged = selection.action !== campusSecurityServiceId;

    this.selectedSecurityService = selection;
  }

  createCampusLink(): Observable<any> {
    const service = this.selectedSecurityService.meta;

    const campusLinkForm = this.utils.getCampusLinkForm();

    campusLinkForm.controls['name'].setValue(service.name);
    campusLinkForm.controls['img_url'].setValue(service.img_url);

    const link_params = <FormGroup>campusLinkForm.controls['link_params'];
    link_params.controls['id'].setValue(service.id);

    return this.service.createCampusLink(campusLinkForm.value);
  }

  createCampusTile(campusLinkId, personaId): Observable<any> {
    const service = this.selectedSecurityService.meta;

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
    return this.createCampusLink().pipe(
      switchMap((link) => this.createCampusTile(link.id, personaId))
    );
  }

  lookupExtraData(id, baseTiles: Array<any>) {
    return baseTiles.filter((tile) => tile.id === id)[0].related_link_data;
  }

  isCampusSecurity(tile: ITile) {
    return tile.related_link_data.link_url === CampusLink.campusSecurityService;
  }

  async getCampusSecurity() {
    const tiles = await this.getTiles();
    const secTile: ITile = tiles
      .filter((t: ITile) => t.visibility_status === TileVisibility.visible)
      .filter(this.isCampusSecurity)[0];

    if (!secTile) {
      return null;
    }

    return secTile.visibility_status === TileVisibility.visible ? secTile : null;
  }

  getTiles(): Promise<any> {
    const search = new HttpParams()
      .set('school_id', this.session.g.get('school').id)
      .set('school_persona_id', this.personaId.toString());

    return this.service.getTilesByPersona(search).toPromise();
  }

  async onSubmit() {
    const formData = this.editForm.form.value;
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);
    const body = this.utils.parseLocalFormToApi(formData);
    const securityService = _get(this.selectedSecurityService, 'action', null);
    const updatePersona$ = this.service.updatePersona(this.personaId, search, body);
    const shouldDeleteOldSecTile = this.securityTileChanged && this.originalSecurityService;
    const shouldCreateSecurityTile =
      this.securityTileChanged && this.selectedSecurityService.action;

    if (shouldDeleteOldSecTile) {
      await this.deleteCampusSecurityTile();
    }

    const updatePersonaAndLink$ = updatePersona$.pipe(
      switchMap(() => this.createSecurityTile(this.personaId))
    );

    const stream$ = shouldCreateSecurityTile ? updatePersonaAndLink$ : updatePersona$;

    stream$.subscribe(
      () => {
        this.trackEditExperienceEvent(formData, this.personaId, securityService);
        this.router.navigate(['/studio/experiences']);
      },
      (err) => {
        let snackBarClass = 'danger';
        const error = err.error.response;

        let message = this.cpI18n.translate('something_went_wrong');
        this.submitButtonData = { ...this.submitButtonData, disabled: false };

        if (error === PersonaValidationErrors.users_associated) {
          snackBarClass = 'warning';
          message = this.cpI18n.translate('t_personas_edit_error_users_associated');
        }

        if (error === PersonaValidationErrors.customization_off) {
          snackBarClass = 'warning';
          message = this.cpI18n.translate('t_personas_edit_error_customization_off');
        }

        this.store.dispatch({
          type: baseActions.SNACKBAR_SHOW,
          payload: {
            sticky: true,
            class: snackBarClass,
            body: message
          }
        });
      }
    );
  }

  onFormValueChanges(form: FormGroup) {
    this.submitButtonData = { ...this.submitButtonData, disabled: !form.valid };
  }

  buildForm(persona) {
    this.form = this.utils.getPersonasForm(persona);
  }

  errorHandler(err = null) {
    let snackBarClass = 'danger';
    let body = _get(err, ['error', 'response'], this.cpI18n.translate('something_went_wrong'));

    if (body === PersonaValidationErrors.customization_off) {
      snackBarClass = 'warning';
      body = this.cpI18n.translate('t_personas_edit_error_customization_off');
    }

    if (err.status === 404) {
      this.router.navigate(['/studio/experiences']);
    }

    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        sticky: true,
        autoClose: true,
        class: snackBarClass,
        body: body
      }
    });
  }

  fetch() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);

    const stream$ = this.service.getPersonaById(this.personaId, search);

    this.getCampusSecurity()
      .then((campusSecurity) => {
        this.originalSecurityService = campusSecurity;

        return super.fetchData(stream$);
      })
      .then(({ data }: any) => {
        this.persona = data;

        this.buildHeader();
        this.buildForm(data);
        this.loadServices();
      })
      .catch((err) => this.errorHandler(err));
  }

  onDeleteError(message) {
    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        sticky: true,
        class: 'danger',
        body: message
      }
    });
  }

  loadServices() {
    const search = new HttpParams().set('school_id', this.session.g.get('school').id);

    this.services$ = this.service.getServices(search).pipe(
      map((services: [{ label: string; action: number; meta: any }]) => {
        if (this.originalSecurityService) {
          const campusSecurityServiceId = this.utils.getCampusSecurityServiceId(
            this.originalSecurityService
          );
          services.forEach((service: any) => {
            if (service.action === campusSecurityServiceId) {
              this.selectedSecurityService = service;
            }
          });
        }

        return services;
      })
    );
  }

  trackEditExperienceEvent(data, experience_id, securityService) {
    const experience_type =
      data.platform === PersonasType.web ? amplitudeEvents.WEB : amplitudeEvents.MOBILE;

    const campus_security = securityService ? amplitudeEvents.YES : amplitudeEvents.NO;

    const eventProperties = {
      experience_id,
      experience_type,
      campus_security,
      credential_type: credentialType[data.login_requirement]
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.STUDIO_UPDATED_EXPERIENCE, eventProperties);
  }

  onDeleted() {
    this.router.navigate(['/studio/experiences']);
  }

  ngOnDestroy() {
    this.store.dispatch({ type: baseActions.SNACKBAR_HIDE });
  }

  ngOnInit(): void {
    this.fetch();

    this.submitButtonData = {
      class: 'primary',
      text: this.cpI18n.translate('save')
    };
  }
}