import { Component, OnInit } from '@angular/core';
import { Headers } from '@angular/http';

import { API } from '../../../.././../config/api';
// import { STATUS } from '../../../.././../shared/constants';
import { FileUploadService } from '../../../../../shared/services';
import { appStorage } from '.././../../../../shared/utils';

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

  constructor(
    private fileUploadService: FileUploadService
  ) { }

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
    this.canvas.destroy();
  }

  onUpload(image) {
    this.isEdit = true;
    this.image = image;

    // https://foliotek.github.io/Croppie/
    let Croppie = require('croppie');

    this.canvas = new Croppie(document.getElementById('canvas_wrapper'), {
      'showZoomer': false,
      'viewport': { width: 700, height: 270 },
      'boundary': { height: 270 },
      // 'url': this.image
      'url': 'https://source.unsplash.com/random/900x500'
    });
  }

  onSave() {
    let promise: Promise<any> = this.canvas.result(
      {
        'type': 'blob',
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
      .subscribe(
      res => console.log(res),
      err => console.log(err)
      );
  }

  ngOnInit() {
    // // https://foliotek.github.io/Croppie/
    // let Croppie = require('croppie');

    // this.canvas = new Croppie(document.getElementById('canvas_wrapper'), {
    //   'showZoomer': false,
    //   'viewport': { width: 700, height: 270 },
    //   'boundary': { height: 270 },
    //   'url': 'https://source.unsplash.com/random/900x500'
    // });
  }
}
