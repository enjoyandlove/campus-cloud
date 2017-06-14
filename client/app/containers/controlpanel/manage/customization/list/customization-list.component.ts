import { Component, OnInit } from '@angular/core';
import { Headers } from '@angular/http';

import { API } from '../../../.././../config/api';
import { appStorage } from '../../../../../shared/utils';
import { CPSession, ISchool } from '../../../../../session';
// import { STATUS } from '../../../.././../shared/constants';
import { FileUploadService } from '../../../../../shared/services';

@Component({
  selector: 'cp-customization-list',
  templateUrl: './customization-list.component.html',
  styleUrls: ['./customization-list.component.scss']
})
export class CustomizationListComponent implements OnInit {
  error;
  image;
  canvas;
  isEdit;
  isError;
  school: ISchool;

  constructor(
    private session: CPSession,
    private fileUploadService: FileUploadService
  ) {
    this.school = this.session.school;
  }

  onError(error) {
    this.isError = true;
    this.error = error;
  }

  onReset() {
    this.isEdit = false;
    this.isError = false;
    this.error = null;
  }

  onCancel() {
    this.onReset();
  }

  onUpload(image) {
    this.isEdit = true;
    this.image = image;

    this.canvas.bind({'url': image});
  }

  onSave() {
    console.log('saving');
    console.log(this.canvas);

    let promise: Promise<any> = this.canvas.result(
      {
        'type': 'base64',
        'size': 'viewport',
        'format': 'jpeg'
      }
    );

    promise
      .then(res => {
        console.log(res);
        console.log(typeof res);
        // let reader = new FileReader();

        // console.log(reader);

        // reader.readAsDataURL(res);

        // console.log(reader.result);

        // // this.onFileUpload(res);
      })
      .catch(err => console.log(err));
  }

    onFileUpload(file) {
    // this.reset.emit();

    // if (!file) { return; }

    // const fileExtension = CPArray.last(file.name.split('.'));

    // if (!CPImage.isSizeOk(file.size, CPImage.MAX_IMAGE_SIZE)) {
    //   this.error.emit(STATUS.FILE_IS_TOO_BIG);
    //   return;
    // }

    // if (!CPImage.isValidExtension(fileExtension, CPImage.VALID_EXTENSIONS)) {
    //   this.error.emit(STATUS.WRONG_EXTENSION);
    //   return;
    // }

    const headers = new Headers();
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
    const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

    headers.append('Authorization', auth);

    this
      .fileUploadService
      .uploadFile(file, url, headers)
      .subscribe(res => console.log(res));
  }

  ngOnInit() {
    // https://foliotek.github.io/Croppie/
    let Croppie = require('croppie');

    this.canvas = new Croppie(document.getElementById('canvas_wrapper'), {
      'enableZoom': false,
      'enableOrientation': false,
      'viewport': { width: 665, height: 270 },
      'boundary': { height: 270 },
      'url': this.school.logo_url
    });
  }
}
