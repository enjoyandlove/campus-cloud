import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { get as _get } from 'lodash';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { IPersona } from '../persona.interface';
import { ITile } from '../tiles/tile.interface';
import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base';
import { PersonasFormComponent } from './../components/personas-form/personas-form.component';
import { PersonasService } from './../personas.service';
import { CPI18nService } from '../../../../../shared/services';
import { PersonaValidationErrors } from './../personas.status';
import { PersonasUtilsService } from './../personas.utils.service';
import { SNACKBAR_SHOW } from '../../../../../reducers/snackbar.reducer';
import { SNACKBAR_HIDE } from './../../../../../reducers/snackbar.reducer';
import { HEADER_UPDATE, IHeader } from './../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-personas-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class PersonasEditComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('editForm') editForm: PersonasFormComponent;

  services$;
  form: FormGroup;
  submitButtonData;
  loading: boolean;
  persona: IPersona;
  personaId: number;
  securityTileChanged;
  selectedSecurityService;
  originalSecurityService;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<IHeader>,
    public route: ActivatedRoute,
    public service: PersonasService,
    public utils: PersonasUtilsService
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
      type: HEADER_UPDATE,
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
    return tile.related_link_data.link_url === 'oohlala://campus_security_service';
  }

  async getCampusSecurity() {
    const tiles = await this.getTiles();

    return tiles.filter(this.isCampusSecurity)[0];
  }

  getTiles(): Promise<any> {
    const search = new HttpParams()
      .set('school_id', this.session.g.get('school').id)
      .set('school_persona_id', this.personaId.toString());

    return this.service.getTilesByPersona(search).toPromise();
  }

  async onSubmit() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);
    const body = this.utils.parseLocalFormToApi(this.editForm.form.value);
    const shouldDeleteOldTile = this.securityTileChanged && this.originalSecurityService;
    const updatePersona$ = this.service.updatePersona(this.personaId, search, body);
    const shouldCreateSecurityTile =
      this.securityTileChanged && this.selectedSecurityService.action;

    if (shouldDeleteOldTile) {
      await this.deleteCampusSecurityTile();
    }

    const updatePersonaAndLink$ = updatePersona$.pipe(
      switchMap(() => this.createSecurityTile(this.personaId))
    );

    const stream$ = shouldCreateSecurityTile ? updatePersonaAndLink$ : updatePersona$;

    stream$.subscribe(
      () => this.router.navigate(['/studio/experiences']),
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
          type: SNACKBAR_SHOW,
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
    this.form = this.fb.group({
      school_id: [this.session.g.get('school').id, Validators.required],
      name: [persona.localized_name_map.en, [Validators.required, Validators.maxLength(255)]],
      platform: [persona.platform, Validators.required],
      rank: [persona.rank, Validators.required],
      login_requirement: [persona.login_requirement],
      pretour_enabled: [persona.pretour_enabled],
      cre_enabled: [persona.cre_enabled],
      clone_tiles: [persona.clone_tiles]
    });
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
      type: SNACKBAR_SHOW,
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
      type: SNACKBAR_SHOW,
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
      map((services) => {
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

  onDeleted() {
    this.router.navigate(['/studio/experiences']);
  }

  ngOnDestroy() {
    this.store.dispatch({ type: SNACKBAR_HIDE });
  }

  ngOnInit(): void {
    this.fetch();

    this.submitButtonData = {
      class: 'primary',
      text: this.cpI18n.translate('t_personas_edit_submit_button')
    };
  }
}
