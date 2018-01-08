import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { isDev } from '../../../../../../../config/env';
import { ClubsService } from '../../../clubs.service';
import { FileUploadService } from '../../../../../../../shared/services';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-clubs-excel-modal',
  templateUrl: './excel-modal.component.html',
  styleUrls: ['./excel-modal.component.scss']
})
export class ClubsExcelModalComponent implements OnInit {
  options;
  fileName;
  downloadLink;

  constructor(
    private router: Router,
    private service: ClubsService,
    private cpI18n: CPI18nService,
    private fileService: FileUploadService,
  ) { }

  parser(file) {
    const url = !isDev ? '/clubs/excel' : 'http://localhost:8000/clubs/excel';
    return this
      .fileService
      .uploadFile(file, url)
      .toPromise()
      .then(
      res => {
        this.service.setModalClubs(JSON.parse(res));
        return Promise.resolve();
      }
      )
      .catch(
      err => {
        const serverError = err.json().error;
        return Promise.reject(serverError ?
                              serverError :
                              this.cpI18n.translate('something_went_wrong'));
      }
      );
  }

  onNavigate() {
    this.router.navigate(['/manage/clubs/import/excel']);
  }

  ngOnInit() {
    this.fileName = 'mass_club_invite_sample.csv';

    const templateUrl = isDev ? `/templates/${this.fileName}` : `/dist/templates/${this.fileName}`;

    this.options = {
      templateUrl,
      validExtensions: ['csv'],
      parser: this.parser.bind(this)
    };
  }
}
