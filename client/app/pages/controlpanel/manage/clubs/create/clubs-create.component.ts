import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Headers } from '@angular/http';

import { API } from '../../../../../config/api';
import { ClubsService } from '../clubs.service';
import { membershipTypes, statusTypes } from './permissions';
import { CPArray, CPMap, CPImage, appStorage } from '../../../../../shared/utils';
import { FileUploadService } from '../../../../../shared/services';

@Component({
  selector: 'cp-clubs-create',
  templateUrl: './clubs-create.component.html',
  styleUrls: ['./clubs-create.component.scss']
})
export class ClubsCreateComponent implements OnInit {
  imageError;
  statusTypes;
  membershipTypes;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    // private errorService: ErrorService,
    private clubsService: ClubsService,
    private fileUploadService: FileUploadService
  ) { }

  onPlaceChange(address) {
    let cpMap = CPMap.getBaseMapObject(address);

    this.form.controls['city'].setValue(cpMap.city);
    this.form.controls['province'].setValue(cpMap.province);
    this.form.controls['country'].setValue(cpMap.country);
    this.form.controls['latitude'].setValue(cpMap.latitude);
    this.form.controls['longitude'].setValue(cpMap.longitude);
    this.form.controls['address'].setValue(`${cpMap.street_number} ${cpMap.street_name}`);
    this.form.controls['postal_code'].setValue(cpMap.postal_code);
  }

  buildAdminControl() {
    return this.fb.group({
      'first_name': [null, Validators.required],
      'last_name': [null, Validators.required],
      'email': [null, Validators.required]
    });
  }

  removeAdminControl(index): void {
    let control = <FormArray>this.form.controls['admins'];
    control.removeAt(index);
  }

  addAdminControl(): void {
    let control = <FormArray>this.form.controls['admins'];
    control.push(this.buildAdminControl());
  }

  onFileUpload(file) {
    this.imageError = null;
    const fileExtension = CPArray.last(file.name.split('.'));

    if (!CPImage.isSizeOk(file.size, CPImage.MAX_IMAGE_SIZE)) {
      this.imageError = 'File too Big';
      return;
    }

    if (!CPImage.isValidExtension(fileExtension, CPImage.VALID_EXTENSIONS)) {
      this.imageError = 'Invalid Extension';
      return;
    }

    const headers = new Headers();
    const url = this.clubsService.getUploadImageUrl();
    const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

    headers.append('Authorization', auth);

    this
      .fileUploadService
      .uploadFile(file, url, headers)
      .subscribe(
      res => this.form.controls['logo_url'].setValue(res.image_url),
      err => console.error(err)
      );
  }

  onSubmit(data) {
    console.log(data);
  }

  onSelectedMembership(type) {
    console.log(type);
  }

  onSelectedStatus(type) {
    console.log(type);
  }

  ngOnInit() {
    this.statusTypes = statusTypes;
    this.membershipTypes = membershipTypes;

    this.form = this.fb.group({
      'name': [null, Validators.required],
      'logo_url': [null, Validators.required],
      'status': [null, Validators.required],
      'membership': [null, Validators.required],
      'location': [null],
      'address': [null],
      'city': [null],
      'country': [null],
      'postal_code': [null],
      'province': [null],
      'latitude': [null],
      'longitude': [null],
      'room': [null],
      'room_data': [null],
      'description': [null],
      'website': [null],
      'phone_number': [null, Validators.required],
      'email': [null, Validators.required],
      'admins': this.fb.array([this.buildAdminControl()]),
    });
  }
}
