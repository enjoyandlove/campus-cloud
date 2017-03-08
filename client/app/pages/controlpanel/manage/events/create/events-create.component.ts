import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Headers } from '@angular/http';

import { API } from '../../../../../config/api';
import { EventsService } from '../events.service';
import { FileUploadService } from '../../../../../shared/services';
import { CPArray, CPImage, appStorage } from '../../../../../shared/utils';

@Component({
  selector: 'cp-events-create',
  templateUrl: './events-create.component.html',
  styleUrls: ['./events-create.component.scss']
})
export class EventsCreateComponent implements OnInit {
  imageError;
  datePickerOpts;
  form: FormGroup;
  formError = false;
  attendance = false;

  constructor(
    private fb: FormBuilder,
    private eventService: EventsService,
    private fileUploadService: FileUploadService
  ) {
    this.form = this.fb.group({
      'title': ['', Validators.required],
      'store_id': ['', Validators.required],
      'location': ['', Validators.required],
      'room_data': ['', Validators.required],
      'address': [''],
      'start': ['', Validators.required],
      'poster_url': ['', Validators.required],
      'end': ['', Validators.required],
      'description': ['', Validators.required],
      'attend_verification_methods': ['']
    });

    this.datePickerOpts = {
      utc: true,
      altInput: true,
      enableTime: true,
      altFormat: 'F j, Y h:i K',
      onClose: function(selectedDates, dateStr, instance) {
        console.log(selectedDates);
        console.log(dateStr);
        console.log(instance);
      }
    };
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
    const url = this.eventService.getUploadImageUrl();
    const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

    headers.append('Authorization', auth);

    this
      .fileUploadService
      .uploadFile(file, url, headers)
      .subscribe(
        res => {
          this.form.controls['poster_url'].setValue(res.image_url);
        },
        err => console.error(err)
      );
  }

  onSubmit() {
    this.formError = false;

    if (!this.form.valid) {
      this.formError = true;
      return;
    }
  }

  ngOnInit() { }
}
