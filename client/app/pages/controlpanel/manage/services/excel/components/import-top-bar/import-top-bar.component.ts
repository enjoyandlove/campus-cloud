import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Headers, URLSearchParams } from '@angular/http';

import { API } from '../../../../../../../config/api';
import { CPSession } from '../../../../../../../session';
import { BaseComponent } from '../../../../../../../base/base.component';
import { CPImage, CPArray, appStorage } from '../../../../../../../shared/utils';
import { StoreService, FileUploadService } from '../../../../../../../shared/services';

@Component({
  selector: 'cp-services-import-top-bar',
  templateUrl: './import-top-bar.component.html',
  styleUrls: ['./import-top-bar.component.scss']
})
export class ServicesImportTopBarComponent extends BaseComponent implements OnInit {
  @Output() checkAll: EventEmitter<boolean> = new EventEmitter();
  @Output() imageChange: EventEmitter<string> = new EventEmitter();
  @Output() deleteServices: EventEmitter<any> = new EventEmitter();
  @Output() categoryChange: EventEmitter<number> = new EventEmitter();

  stores;
  imageError;
  loading = true;

  constructor(
    private session: CPSession,
    private storeService: StoreService,
    private fileUploadService: FileUploadService
  ) {
    super();
    this.fetch();

    super.isLoading().subscribe(res => this.loading = res);
  }

  private fetch() {
    const school = this.session.school;
    let search: URLSearchParams = new URLSearchParams();
    search.append('school_id', school.id.toString());

    const stores$ = this.storeService.getStores(search).map(res => {
      const stores = [
        {
          'label': 'Host Name',
          'action': null
        }
      ];

      res.forEach(store => {
        stores.push({
          'label': store.name,
          'action': store.id
        });
      });
      return stores;
    });

    super
      .fetchData(stores$)
      .then(res => this.stores = res.data)
      .catch(err => console.error(err));
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
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
    const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

    headers.append('Authorization', auth);

    this
      .fileUploadService
      .uploadFile(file, url, headers)
      .subscribe(
      res => {
        this.imageChange.emit(res.image_url);
      },
      err => console.error(err)
      );
  }

  ngOnInit() { }
}
