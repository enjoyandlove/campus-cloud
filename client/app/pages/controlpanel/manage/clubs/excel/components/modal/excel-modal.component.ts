import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ENV } from '../../../../../../../config/env';
import { ClubsService } from '../../../clubs.service';
import { STATUS } from '../../../../../../../shared/constants';
import { FileUploadService } from '../../../../../../../shared/services';

@Component({
  selector: 'cp-clubs-excel-modal',
  templateUrl: './excel-modal.component.html',
  styleUrls: ['./excel-modal.component.scss']
})
export class ClubsExcelModalComponent implements OnInit {
  error;
  uploaded;
  downloadLink;

  constructor(
    private router: Router,
    private service: ClubsService,
    private fileService: FileUploadService,
  ) {
    this.downloadLink = ENV === 'production' ?
                                '/dist/templates/mass_club_invite_sample.xlsx' :
                                '/templates/mass_club_invite_sample.xlsx';
  }

  onSubmit(data) {
    console.log(data);
  }

  fileIsValid(file) {
    let result = [];
    let validators = [
      {
        'exp': file.name.split('.').pop() === 'xlsx',
        'error': STATUS.WRONG_EXTENSION,
        'isError': false
      },
      {
        'exp': file.size > 5000,
        'error': STATUS.FILE_IS_TOO_BIG,
        'isError': false
      }
    ];

    validators.map(validator => {
      if (!validator.exp) {
        validator.isError = true;
        result.push(validator);
      }
      return validator;
    });
    return result;
  }

  onFileUpload(file) {
    const validation = this.fileIsValid(file);
    this.error = '';

    if (!validation.length) {
      const url = ENV === 'production' ? '/clubs/excel' : 'http://localhost:8000/clubs/excel';
      this
      .fileService
      .uploadFile(file, url)
      .subscribe(
        (res) => {
          this.uploaded = true;
          console.log(res);
          this.service.setModalClubs(JSON.parse(res));
        },
        err => this.error = err.json().error
      );
      return;
    }

    this.error = validation[0].error;
  }

  onNavigate() {
    this.router.navigate(['/manage/clubs/import/excel']);
  }

  ngOnInit() {
    // console.log($('#excelModal'));
  }
}
