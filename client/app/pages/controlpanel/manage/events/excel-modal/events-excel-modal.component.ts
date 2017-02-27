import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

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
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private store: Store<IHeader>,
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

  onUploadFile() {
    console.log('file upload');
  }

  onChange(data) {
    this
      .fileService
      .uploadFile(data.target.files[0], 'http://localhost:8000/events/excel')
      .subscribe(
        res => console.log(res),
        err => console.log(err)
      );
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

  ngOnInit() { }
}
