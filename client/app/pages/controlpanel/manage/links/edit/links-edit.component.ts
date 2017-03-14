import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { Headers } from '@angular/http';

import { API } from '../../../../../config/api';
import { LinksService } from '../links.service';
import { FileUploadService } from '../../../../../shared/services';
import { CPImage, CPArray, appStorage } from '../../../../../shared/utils';

@Component({
  selector: 'cp-links-edit',
  templateUrl: './links-edit.component.html',
  styleUrls: ['./links-edit.component.scss']
})
export class LinksEditComponent implements OnInit {
  @Input() link: any;
  imageError;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: LinksService,
    private fileUploadService: FileUploadService
  ) { }

  buildForm() {
    this.form = this.fb.group({
      'link_url': [this.link.link_url, Validators.required],
      'name': [this.link.name, Validators.required],
      'description': [this.link.description, Validators.maxLength(512)],
      'img_url': [this.link.img_url],
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
        this.form.controls['poster_url'].setValue(res.image_url);
      },
      err => console.error(err)
      );
  }

  doSubmit() {
    console.log(this.form.value);
  }

  ngOnChanges() {
    // console.log(this.link);
    if (this.link) {
      this.buildForm();
    }
  }

  ngOnInit() {
    // console.log(this.link);
    // this.buildForm();
  }
}
