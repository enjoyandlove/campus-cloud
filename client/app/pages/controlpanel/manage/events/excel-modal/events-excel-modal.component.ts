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

  onFileUpload(file) {
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
