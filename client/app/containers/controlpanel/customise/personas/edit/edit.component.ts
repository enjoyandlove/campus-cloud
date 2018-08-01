import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HEADER_UPDATE, IHeader } from './../../../../../reducers/header.reducer';
import { SNACKBAR_HIDE } from './../../../../../reducers/snackbar.reducer';
import { PersonasFormComponent } from './../components/personas-form/personas-form.component';
import { PersonasService } from './../personas.service';
import { PersonaValidationErrors } from './../personas.status';
import { PersonasUtilsService } from './../personas.utils.service';
import { BaseComponent } from '../../../../../base';
import { SNACKBAR_SHOW } from '../../../../../reducers/snackbar.reducer';
import { CPSession } from '../../../../../session';
import { CPI18nService } from '../../../../../shared/services';
import { IPersona } from '../persona.interface';
import { ITile } from '../tiles/tile.interface';

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

    const guideTileFormPersonaZero = {
      ...guideTileForm.value,
      school_persona_id: 0
    };

    const guidePersonaZero$ = this.service.createGuideTile(guideTileFormPersonaZero);

    return guidePersonaZero$.pipe(
      switchMap((guide: any) => {
        const body = {
          ...guideTileFormPersonaZero,
          school_persona_id: personaId,
          extra_info: {
            id: guide.id
          }
        };

        return this.service.createGuideTile(body);
      })
    );
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

  zipTiles(baseTiles: Array<any>, personaTiles: Array<any>): Array<any> {
    return personaTiles.map((tile: ITile) => {
      const relatedLinkDataEmpty = Object.keys(tile.related_link_data).length === 0;

      return relatedLinkDataEmpty
        ? {
            ...tile,
            related_link_data: this.lookupExtraData(tile.extra_info.id, baseTiles)
          }
        : tile;
    });
  }

  async getCampusSecurity() {
    const [baseTiles, personaTiles] = await this.getTiles();
    const zipTiles = this.zipTiles(baseTiles, personaTiles);

    return zipTiles.filter(this.isCampusSecurity)[0];
  }

  getTiles(): Promise<any> {
    const searchPersonaZero = new HttpParams().set('school_id', this.session.g.get('school').id);

    const searchPersonaId = new HttpParams()
      .set('school_id', this.session.g.get('school').id)
      .set('school_persona_id', this.personaId.toString());

    const baseTiles$ = this.service.getTilesByPersona(searchPersonaZero);
    const tilesByPersonaId$ = this.service.getTilesByPersona(searchPersonaId);

    const stream$ = combineLatest(baseTiles$, tilesByPersonaId$);

    return stream$.toPromise();
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
      () => this.router.navigate(['/customize/personas']),
      (err) => {
        const error = err.error.response;

        let message = this.cpI18n.translate('something_went_wrong');
        this.submitButtonData = { ...this.submitButtonData, disabled: false };

        if (error === PersonaValidationErrors.users_associated) {
          message = this.cpI18n.translate('t_personas_edit_error_users_associated');
        }

        this.store.dispatch({
          type: SNACKBAR_SHOW,
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
      });
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
    this.router.navigate(['/customize/personas']);
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
