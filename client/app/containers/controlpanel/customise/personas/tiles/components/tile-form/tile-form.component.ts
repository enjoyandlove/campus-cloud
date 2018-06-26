import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FileUploadService } from './../../../../../../../shared/services/file-upload.service';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-personas-tile-form',
  templateUrl: './tile-form.component.html',
  styleUrls: ['./tile-form.component.scss']
})
export class PersonasTileFormComponent implements OnInit {
  @Input() form: FormGroup;

  @Output() formValueChange: EventEmitter<FormGroup> = new EventEmitter();

  resources;
  contentTypes;
  uploadImageBtn;
  extraFields = false;
  tilePreview: { color: string; img_url: string; name: string };

  constructor(public cpI18n: CPI18nService, public fileService: FileUploadService) {}

  onContentTypeChange(selected) {
    console.log(selected);
  }

  updateTilPreview(key, update) {
    this.tilePreview = {
      ...this.tilePreview,
      [key]: update
    };
  }

  onColorChanged(hexColor: string) {
    const colorStr = hexColor.replace('#', '');
    this.form.controls['color'].setValue(colorStr);

    this.updateTilPreview('color', colorStr);
  }

  populateDropdowns() {
    this.resources = require('./resources.json').map((resource) => {
      return {
        ...resource,
        label: this.cpI18n.translate(resource.label)
      };
    });
    this.contentTypes = require('./content-types.json').map((content) => {
      return {
        ...content,
        label: this.cpI18n.translate(content.label)
      };
    });
  }

  populateTilePreview() {
    this.tilePreview = {
      ...this.tilePreview,
      name: this.form.controls['name'].value || '',
      color: this.form.controls['color'].value,
      img_url: this.form.controls['img_url'].value
    };
  }

  uploadImage(image) {
    this.fileService
      .uploadFile(image)
      .subscribe(({ image_url }: any) => this.form.controls['img_url'].setValue(image_url));
  }

  onFileChanged(image) {
    const validate = this.fileService.validImage(image);

    if (validate.valid) {
      this.uploadImage(image);
    }
  }

  listenToFormChanges() {
    this.form.valueChanges.subscribe(() => {
      this.updateTilPreview('name', this.form.controls['name'].value);
      this.updateTilPreview('color', this.form.controls['color'].value);
      this.updateTilPreview('img_url', this.form.controls['img_url'].value);
      this.formValueChange.emit(this.form);
    });
  }

  ngOnInit(): void {
    this.uploadImageBtn = this.cpI18n.translate('button_add_photo');
    this.populateDropdowns();
    this.listenToFormChanges();
    this.populateTilePreview();
  }
}
