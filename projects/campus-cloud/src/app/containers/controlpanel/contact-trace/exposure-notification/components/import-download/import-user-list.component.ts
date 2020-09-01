import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnvService } from '@campus-cloud/config/env';
import { CPI18nService, FileUploadService } from '@campus-cloud/shared/services';
import { environment } from '@projects/campus-cloud/src/environments/environment';
import { READY_MODAL_DATA } from '@ready-education/ready-ui/overlays';

@Component({
  selector: 'cp-import-user-list',
  templateUrl: './import-user-list.component.html',
  styleUrls: ['./import-user-list.component.scss']
})
export class ImportUserListComponent implements OnInit {

  options;
  fileName;
  users;

  constructor(
    private router: Router,
    private env: EnvService,
    private cpI18n: CPI18nService,
    private fileService: FileUploadService,
    @Inject(READY_MODAL_DATA) public modal: any
  ) {}

  parser(file) {
    const url =
      this.env.name !== 'development'
        ? '/announcements/import'
        : 'http://localhost:8000/announcements/import';

    return this.fileService
      .uploadFile(file, url)
      .toPromise()
      .then((res) => {
        this.users = res;

        return Promise.resolve();
      })
      .catch((err) => {
        const serverError = err.error.error;

        return Promise.reject(
          serverError ? serverError : this.cpI18n.translate('something_went_wrong')
        );
      });
  }

  ngOnInit() {
    this.fileName = 'mass_user_upload.csv';

    const templateUrl =
      this.env.name === 'development'
        ? `/assets/templates/${this.fileName}`
        : `${environment.root}assets/templates/${this.fileName}`;

    this.options = {
      templateUrl,
      validExtensions: ['csv'],
      parser: this.parser.bind(this),
      instruction: 'csv_modal_instruction_audience'
    };
  }

  onNavigate() {
    this.modal.onAction(this.users);
  }

  close() {
    this.modal.onClose();
  }
}
