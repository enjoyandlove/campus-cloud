import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { ClubsService } from '../clubs.service';
import { isDev } from '../../../../../config/env';
import { CPSession } from '../../../../../session';
import { CPI18nPipe } from '../../../../../shared/pipes';
import { BaseComponent } from '../../../../../base/base.component';
import { CLUBS_MODAL_RESET } from '../../../../../reducers/clubs.reducer';
import { CPImageUploadComponent } from '../../../../../shared/components';
import { FileUploadService, CPI18nService } from '../../../../../shared/services';
import { HEADER_UPDATE, HEADER_DEFAULT } from '../../../../../reducers/header.reducer';

const i18n = new CPI18nPipe();

@Component({
  selector: 'cp-clubs-excel',
  templateUrl: './clubs-excel.component.html',
  styleUrls: ['./clubs-excel.component.scss']
})
export class ClubsExcelComponent extends BaseComponent implements OnInit, OnDestroy {
  clubs;
  formError;
  buttonData;
  form: FormGroup;
  isFormReady = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<any>,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private clubService: ClubsService,
    private fileUploadService: FileUploadService
  ) {
    super();
    this
      .store
      .select('CLUBS')
      .subscribe(
        res => {
          this.clubs = !isDev ? res : require('./mock.json');
          this.buildHeader();
          this.buildForm();
        }
    );
  }

  onRemoveImage(index) {
    const clubsControl = <FormArray>this.form.controls['clubs'];
    const control = <FormGroup>clubsControl.at(index);
    control.controls['logo_url'].setValue(null);
  }

  private buildHeader() {
    const subheading = i18n.transform('clubs_import_items_to_import', this.clubs.length);
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': 'clubs_import_heading',
        'crumbs': {
          'url': 'clubs',
          'label': 'clubs'
        },
        'em': `[NOTRANSLATE]${subheading}[NOTRANSLATE]`,
        'children': []
      }
    });
  }

  private buildForm() {
    this.form = this.fb.group({
      'clubs': this.fb.array([])
    });

    this.buildGroup();
  }

  private buildGroup() {
    const control = <FormArray>this.form.controls['clubs'];

    this.clubs.forEach(club => {
      control.push(this.buildClubControl(club));
    });

    this.isFormReady = true;
  }

  buildClubControl(club) {
    return this.fb.group({
      'name': [club.club_name, Validators.required],
      'logo_url': [null, Validators.required],
      'status': [0],
      'has_membership': [true],
      'email': [club.email],
      'description': [club.description],
      'phone': [club.phone_number],
      'website': [club.website],
    });
  }

  ngOnDestroy() {
    this.store.dispatch({ type: CLUBS_MODAL_RESET });
    this.store.dispatch({ type: HEADER_DEFAULT });
  }

  onImageUpload(image, index) {
    const imageUpload = new CPImageUploadComponent(this.cpI18n, this.fileUploadService);
    const promise = imageUpload.onFileUpload(image, true);

    promise
      .then((res: any) => {
        const clubsControl = <FormArray>this.form.controls['clubs'];
        const control = <FormGroup>clubsControl.at(index);
        control.controls['logo_url'].setValue(res.image_url);
      })
      .catch(err => { throw new Error(err) });
  }

  onSubmit() {
    this.formError = false;

    if (!this.form.valid) {
      this.formError = true;
      return;
    }

    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    this
      .clubService
      .createClub(this.form.value.clubs, search)
      .subscribe(
        _ => this.router.navigate(['/manage/clubs']),
        err => { throw new Error(err) }
      );
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('clubs_import_button_submit'),
      class: 'primary',
      disabled: true
    }

    this.form.valueChanges.subscribe(_ => {
      this.buttonData = Object.assign(
        {},
        this.buttonData, { disabled: !this.form.valid });
    })
  }
}
