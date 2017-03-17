import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Headers } from '@angular/http';

import { ILink } from '../link.interface';
import { API } from '../../../../../config/api';
import { LinksService } from '../links.service';
import { FileUploadService } from '../../../../../shared/services';
import { CPImage, CPArray, appStorage } from '../../../../../shared/utils';

declare var $: any;

@Component({
  selector: 'cp-links-create',
  templateUrl: './links-create.component.html',
  styleUrls: ['./links-create.component.scss']
})
export class LinksCreateComponent implements OnInit {
  @Output() createLink: EventEmitter<ILink> = new EventEmitter();
  imageError;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: LinksService,
    private fileUploadService: FileUploadService
  ) { }

  buildForm() {
    this.form = this.fb.group({
      'name': ['', Validators.required],
      'url': ['', Validators.required],
      'school_id': [157, Validators.required],
      'description': ['', Validators.maxLength(512)],
      'img_url': [''],
    });
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
    const url = this.service.getUploadImageUrl();
    const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

    headers.append('Authorization', auth);

    this
      .fileUploadService
      .uploadFile(file, url, headers)
      .subscribe(
      res => {
        this.form.controls['img_url'].setValue(res.image_url);
      },
      err => console.error(err)
      );
  }

  doSubmit() {
    this
      .service
      .createLink(this.form.value)
      .subscribe(
        res => {
          $('#linksCreate').modal('hide');
          this.createLink.emit(res);

        },
        err => console.log(err),
      );
  }

  ngOnInit() {
    this.buildForm();
  }
}
