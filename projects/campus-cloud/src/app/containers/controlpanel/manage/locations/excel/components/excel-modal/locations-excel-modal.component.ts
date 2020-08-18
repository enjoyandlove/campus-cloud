import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { EnvService } from '@campus-cloud/config/env';
import { FileUploadService, CPI18nService } from '@campus-cloud/shared/services';
import { environment } from '@projects/campus-cloud/src/environments/environment';
import { baseActions } from '@projects/campus-cloud/src/app/store';

@Component({
  selector: 'cp-locations-excel-modal',
  templateUrl: './locations-excel-modal.component.html',
  styleUrls: ['./locations-excel-modal.component.scss']
})
export class LocationsExcelModalComponent implements OnInit {
  options;
  fileName;

  constructor(
    private router: Router,
    private env: EnvService,
    private cpI18n: CPI18nService,
    private fileService: FileUploadService,
    private store: Store<any>
  ) {}

  parser(file) {
    const url =
      this.env.name !== 'development'
        ? '/locations/excel'
        : 'http://localhost:8000/locations/excel';

    return this.fileService
      .uploadFile(file, url)
      .toPromise()
      .then((res: any) => {
        this.setModalLocations(JSON.parse(res));

        return Promise.resolve();
      })
      .catch((err) => {
        const locationErr = err.error.error;

        return Promise.reject(
          locationErr ? locationErr : this.cpI18n.translate('something_went_wrong')
        );
      });
  }

  onNavigate() {
    this.router.navigate(['/manage/locations/import/excel']);
  }

  setModalLocations(locations: any[]): void {
    this.store.dispatch({
      type: baseActions.LOCATIONS_MODAL_SET,
      payload: locations
    });
  }

  ngOnInit() {
    this.fileName = 'mass_locations_upload.csv';

    const templateUrl =
      this.env.name === 'development'
        ? `/assets/templates/${this.fileName}`
        : `${environment.root}assets/templates/${this.fileName}`;

    this.options = {
      templateUrl,
      validExtensions: ['csv'],
      parser: this.parser.bind(this)
    };
  }
}
