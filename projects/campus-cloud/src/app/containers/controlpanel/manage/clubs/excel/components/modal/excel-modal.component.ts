import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ClubsService } from '../../../clubs.service';
import { EnvService } from '@campus-cloud/config/env';
import { CPI18nService, FileUploadService } from '@campus-cloud/shared/services';
import { environment } from '@projects/campus-cloud/src/environments/environment';
import { isClubAthletic, clubAthleticLabels } from '../../../clubs.athletics.labels';

@Component({
  selector: 'cp-clubs-excel-modal',
  templateUrl: './excel-modal.component.html',
  styleUrls: ['./excel-modal.component.scss']
})
export class ClubsExcelModalComponent implements OnInit {
  @Input() isAthletic = isClubAthletic.club;

  labels;
  options;
  fileName;
  downloadLink;

  constructor(
    private router: Router,
    private env: EnvService,
    private service: ClubsService,
    private cpI18n: CPI18nService,
    private fileService: FileUploadService
  ) {}

  parser(file) {
    const url =
      this.env.name !== 'development' ? '/clubs/excel' : 'http://localhost:8000/clubs/excel';

    return this.fileService
      .uploadFile(file, url)
      .toPromise()
      .then((res: any) => {
        this.service.setModalClubs(JSON.parse(res));

        return Promise.resolve();
      })
      .catch((err) => {
        const serverError = err.error.error;

        return Promise.reject(
          serverError ? serverError : this.cpI18n.translate('something_went_wrong')
        );
      });
  }

  onNavigate() {
    this.labels = clubAthleticLabels(this.isAthletic);
    this.router.navigate(['/manage/' + this.labels.club_athletic + '/import/excel']);
  }

  ngOnInit() {
    this.fileName = 'mass_club_invite_sample.csv';

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
