import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { URLSearchParams } from '@angular/http';

import { isDev } from '../../../../config/env';
import { CPSession } from '../../../../session';
import { AudienceService } from './../audience.service';
import { FileUploadService, CPI18nService } from '../../../../shared/services';

@Component({
  selector: 'cp-audience-import',
  templateUrl: './audience-import.component.html',
  styleUrls: ['./audience-import.component.scss']
})
export class AudienceImportComponent implements OnInit {
  @Output() launchCreateModal: EventEmitter<any> = new EventEmitter();

  users;
  options;
  fileName;
  form: FormGroup;

  constructor(
    public fb: FormBuilder,
    public session: CPSession,
    private cpI18n: CPI18nService,
    public service: AudienceService,
    private fileService: FileUploadService
  ) {}

  parser(file) {
    const url = !isDev ? '/announcements/import' : 'http://localhost:8000/announcements/import';

    return this.fileService
      .uploadFile(file, url)
      .toPromise()
      .then((res) => {
        this.users = res;

        return Promise.resolve();
      })
      .catch((err) => {
        const serverError = err.json().error;

        return Promise.reject(
          serverError ? serverError : this.cpI18n.translate('something_went_wrong')
        );
      });
  }

  onSave() {
    // $('#audienceImport').modal('hide');
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());
    this.form.controls['user_emails'].setValue(this.users.map((user) => user.email));
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, Validators.required],
      user_emails: [[], Validators.required]
    });

    this.fileName = 'mass_user_upload.csv';

    const templateUrl = isDev ? `/templates/${this.fileName}` : `/dist/templates/${this.fileName}`;

    this.options = {
      templateUrl,
      validExtensions: ['csv'],
      parser: this.parser.bind(this)
    };
  }
}
