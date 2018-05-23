import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base';
import { PersonasService } from './../personas.service';
import { CPI18nService } from '../../../../../shared/services';
import { PersonasUtilsService } from './../personas.utils.service';
import { SNACKBAR_SHOW } from '../../../../../reducers/snackbar.reducer';
import { IHeader, HEADER_UPDATE } from './../../../../../reducers/header.reducer';
import { PersonasFormComponent } from './../components/personas-form/personas-form.component';

@Component({
  selector: 'cp-personas-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class PersonasEditComponent extends BaseComponent implements OnInit {
  @ViewChild('editForm') editForm: PersonasFormComponent;

  loading: boolean;
  personaId: number;
  submitButtonData;
  deleteButtonData;
  form: FormGroup;

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

  onSubmit() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);

    const body = this.utils.parseLocalFormToApi(this.editForm.form.value);

    this.service.updatePersona(this.personaId, search, body).subscribe(
      () => {
        this.submitButtonData = { ...this.submitButtonData, disabled: false };

        this.store.dispatch({
          type: SNACKBAR_SHOW,
          payload: {
            sticky: true,
            autoClose: true,
            class: 'success',
            body: this.cpI18n.translate('t_personas_edit_message_on_save_ok')
          }
        });
      },
      () => {
        this.submitButtonData = { ...this.submitButtonData, disabled: false };

        this.store.dispatch({
          type: SNACKBAR_SHOW,
          payload: {
            autoClose: true,
            class: 'danger',
            body: this.cpI18n.translate('t_personas_edit_message_on_save_error')
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
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);

    const stream$ = this.service.getPersonaById(this.personaId, search);

    super.fetchData(stream$).then(({ data }) => {
      this.buildHeader();
      this.buildForm(data);
    });
  }

  onDelete() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);

    this.service.deletePersonaById(this.personaId, search).subscribe(
      () => this.router.navigate(['/customize/personas']),
      () =>
        this.store.dispatch({
          type: SNACKBAR_SHOW,
          payload: {
            sticky: true,
            class: 'danger',
            body: this.cpI18n.translate('something_went_wrong')
          }
        })
    );
  }

  ngOnInit(): void {
    this.fetch();

    this.submitButtonData = {
      class: 'primary',
      text: this.cpI18n.translate('t_personas_edit_submit_button')
    };

    this.deleteButtonData = {
      class: 'danger',
      text: this.cpI18n.translate('t_personas_edit_delete_button')
    };
  }
}
