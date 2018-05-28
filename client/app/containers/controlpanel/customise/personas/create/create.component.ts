import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { CPSession } from '../../../../../session';
import { CPDate } from '../../../../../shared/utils';
import { PersonasService } from './../personas.service';
import { CPI18nService } from '../../../../../shared/services';
import { PersonasUtilsService } from './../personas.utils.service';
import { SNACKBAR_SHOW } from '../../../../../reducers/snackbar.reducer';
import { PersonasLoginRequired, PersonasType } from './../personas.status';
import { IHeader, HEADER_UPDATE } from './../../../../../reducers/header.reducer';

import { PersonasFormComponent } from './../components/personas-form/personas-form.component';

@Component({
  selector: 'cp-personas-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class PersonasCreateComponent implements OnInit {
  @ViewChild('createForm') createForm: PersonasFormComponent;

  buttonData;
  form: FormGroup;

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

  onSubmit() {
    const body = this.utils.parseLocalFormToApi(this.createForm.form.value);
    this.service.createPersona(body).subscribe(
      () => this.router.navigate(['/customize/personas']),
      () => {
        this.store.dispatch({
          type: SNACKBAR_SHOW,
          payload: {
            autoClose: true,
            class: 'danger',
            body: this.cpI18n.translate('something_went_wrong')
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
      clone_tiles: [true]
    });
  }

  ngOnInit(): void {
    this.buildForm();
    this.buildHeader();

    this.buttonData = {
      class: 'primary',
      disabled: true,
      text: this.cpI18n.translate('t_personas_create_submit_button')
    };
  }
}
