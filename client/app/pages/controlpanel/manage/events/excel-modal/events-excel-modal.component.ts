import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { EventsService } from '../events.service';
import { FileUploadService } from '../../../../../shared/services';

import {
  IHeader,
  HEADER_UPDATE
} from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-events-excel-modal',
  templateUrl: './events-excel-modal.component.html',
  styleUrls: ['./events-excel-modal.component.scss']
})
export class EventsExcelModalComponent implements OnInit {
  uploaded;
  form: FormGroup;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<IHeader>,
    private service: EventsService,
    private fileService: FileUploadService,
  ) {
    this.buildHeader();

    this.form = this.fb.group({
      'link': ['', Validators.required]
    });
  }

  onSubmit(data) {
    console.log(data);
  }

  fileIsValid(file) {
    let validation = {};

    const ext = file.name.split('.').pop();
    const size = file.size;
    validation['isExt'] = {
      error: 'Make sure you are uploading an excel file',
      isValid: ext === 'xlsx'
    };

    validation['isSize'] = {
      error: 'File to big',
      isValid: size < 50000
    };

    return validation;
  }

  onFileUpload(file) {
    const validation = this.fileIsValid(file);

    if (validation['isExt'].isValid && validation['isSize'].isValid) {
      this
      .fileService
      .uploadFile(file, 'http://localhost:8000/events/excel')
      .subscribe(
        (res) => {
          this.uploaded = true;
          this.service.setModalEvents(JSON.parse(res));
        },
        err => console.log(err)
      );
    }
    return;
  }

  onNavigate() {
    this.router.navigate(['/manage/events/import/excel']);
  }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': 'Import Events from Excel',
        'subheading': '',
        'children': []
      }
    });
  }

  ngOnInit() {
    // console.log($('#excelModal'));
  }
}
