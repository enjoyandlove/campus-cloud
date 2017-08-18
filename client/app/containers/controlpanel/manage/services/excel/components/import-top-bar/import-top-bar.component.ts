import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';

import { API } from '../../../../../../../config/api';
import { FileUploadService } from '../../../../../../../shared/services';
import { CPImage, CPArray, appStorage } from '../../../../../../../shared/utils';

@Component({
  selector: 'cp-services-import-top-bar',
  templateUrl: './import-top-bar.component.html',
  styleUrls: ['./import-top-bar.component.scss']
})
export class ServicesImportTopBarComponent implements OnInit {
  @Input() categories: Observable<any>;

  @Output() checkAll: EventEmitter<boolean> = new EventEmitter();
  @Output() imageChange: EventEmitter<string> = new EventEmitter();
  @Output() deleteServices: EventEmitter<any> = new EventEmitter();
  @Output() categoryChange: EventEmitter<number> = new EventEmitter();

  stores;
  imageError;
  loading = true;

  constructor(
    private fileUploadService: FileUploadService
  ) { }

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
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
    const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

    headers.append('Authorization', auth);

    this
      .fileUploadService
      .uploadFile(file, url, headers)
      .subscribe(
      res => this.imageChange.emit(res.image_url),
      err => console.error(err)
      );
  }

  ngOnInit() {}
}
