import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { get as _get } from 'lodash';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HEADER_UPDATE, IHeader } from './../../../../../reducers/header.reducer';
import { PersonasFormComponent } from './../components/personas-form/personas-form.component';
import { PersonasService } from './../personas.service';
import { PersonasLoginRequired, PersonasType, PersonaValidationErrors } from './../personas.status';
import { PersonasUtilsService } from './../personas.utils.service';
import { SNACKBAR_SHOW } from '../../../../../reducers/snackbar.reducer';
import { CPSession } from '../../../../../session';
import { CPI18nService } from '../../../../../shared/services';
import { CPDate } from '../../../../../shared/utils';

@Component({
  selector: 'cp-personas-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class PersonasCreateComponent implements OnInit {
  @ViewChild('createForm') createForm: PersonasFormComponent;

  services$;
  buttonData;
  form: FormGroup;
  campusSecurityTile;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<IHeader>,
    public service: PersonasService,
    public utils: PersonasUtilsService
  ) {}

  buildHeader() {
    const payload = {
      heading: 't_personas_create_header_title',
      subheading: null,
      em: null,
      children: []
    };

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload
    });
  }

  onSecurityServiceChanged(selection) {
    const serviceMeta = _get(selection, 'meta', null);

    this.campusSecurityTile = serviceMeta;
  }

  createCampusLink(): Observable<any> {
    const service = this.campusSecurityTile;

    const campusLinkForm = this.utils.getCampusLinkForm();

    campusLinkForm.controls['name'].setValue(service.name);
    campusLinkForm.controls['img_url'].setValue(service.img_url);

    const link_params = <FormGroup>campusLinkForm.controls['link_params'];
    link_params.controls['id'].setValue(service.id);

    return this.service.createCampusLink(campusLinkForm.value);
  }

  createCampusTile(campusLinkId, personaId): Observable<any> {
    const service = this.campusSecurityTile;

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

  onSubmit() {
    const body = this.utils.parseLocalFormToApi(this.createForm.form.value);
    const createPersona$ = this.service.createPersona(body);

    const stream$ = this.campusSecurityTile
      ? createPersona$.pipe(switchMap(({ id }: any) => this.createSecurityTile(id)))
      : createPersona$;

    stream$.subscribe(
      (persona) => this.router.navigate([`/customize/personas/${persona.id}`]),
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
    this.buttonData = { ...this.buttonData, disabled: !form.valid };
  }

  buildForm() {
    this.form = this.fb.group({
      school_id: [this.session.g.get('school').id, Validators.required],
      name: [null, [Validators.required, Validators.maxLength(255)]],
      platform: [PersonasType.mobile, Validators.required],
      rank: [CPDate.now(this.session.tz).unix(), Validators.required],
      login_requirement: [PersonasLoginRequired.optional],
      pretour_enabled: [false],
      cre_enabled: [false],
      clone_tiles: [false]
    });
  }

  loadServices() {
    const search = new HttpParams().set('school_id', this.session.g.get('school').id);

    this.services$ = this.service.getServices(search);
  }

  ngOnInit(): void {
    this.buildForm();
    this.buildHeader();
    this.loadServices();

    this.buttonData = {
      class: 'primary',
      disabled: true,
      text: this.cpI18n.translate('t_personas_create_submit_button')
    };
  }
}
