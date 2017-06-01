import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { ClubsService } from '../clubs.service';
import { isDev } from '../../../../../config/env';
import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base/base.component';
import { CLUBS_MODAL_RESET } from '../../../../../reducers/clubs.reducer';
import { HEADER_UPDATE, HEADER_DEFAULT } from '../../../../../reducers/header.reducer';
import { CPImageUploadComponent } from '../../../../../shared/components';
import { FileUploadService } from '../../../../../shared/services/file-upload.service';

@Component({
  selector: 'cp-clubs-excel',
  templateUrl: './clubs-excel.component.html',
  styleUrls: ['./clubs-excel.component.scss']
})
export class ClubsExcelComponent extends BaseComponent implements OnInit, OnDestroy {
  clubs;
  formError;
  form: FormGroup;
  isFormReady = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<any>,
    private session: CPSession,
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

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': 'Import Clubs',
        'em': `${this.clubs.length} valid student club(s) in the file`,
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
      'phone': [club.phone],
      'website': [club.website],
    });
  }

  ngOnDestroy() {
    this.store.dispatch({ type: CLUBS_MODAL_RESET });
    this.store.dispatch({ type: HEADER_DEFAULT });
  }

  onImageUpload(image, index) {
    let imageUpload = new CPImageUploadComponent(this.fileUploadService);
    let promise = imageUpload.onFileUpload(image, true);

    promise
      .then((res: any) => {
        let clubsControl = <FormArray>this.form.controls['clubs'];
        let control = <FormGroup>clubsControl.at(index);
        control.controls['logo_url'].setValue(res.image_url);
      })
      .catch(err => console.log(err));
  }

  onSubmit() {
    this.formError = false;

    if (!this.form.valid) {
      this.formError = true;
      return;
    }

    let search = new URLSearchParams();
    search.append('school_id', this.session.school.id.toString());

    this
      .clubService
      .createClub(this.form.value.clubs, search)
      .subscribe(
        _ => this.router.navigate(['/manage/clubs']),
        err => console.log(err)
      );
  }

  ngOnInit() { }
}
