import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';
import { FileUploadService } from '../../../../../../../shared/services';

@Component({
  selector: 'cp-personas-tile-guide-form',
  templateUrl: './tile-guide-form.component.html',
  styleUrls: ['./tile-guide-form.component.scss']
})
export class PersonasTileGuideFormComponent implements OnInit {
  @Input() form: FormGroup;

  @Output() changed: EventEmitter<FormGroup> = new EventEmitter();

  uploadImageBtn;
  tilePreview: { color: string; img_url: string; name: string };

  constructor(public cpI18n: CPI18nService, public fileService: FileUploadService) {}

  updateTilePreview(key, update) {
    this.tilePreview = {
      ...this.tilePreview,
      [key]: update
    };
  }

  onColorChange(hexColor: string) {
    const colorStr = hexColor.replace('#', '');
    this.form.controls['color'].setValue(colorStr);

    this.updateTilePreview('color', colorStr);
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
    this.fileService.uploadFile(image).subscribe(({ image_url }: any) => {
      this.form.controls['img_url'].setValue(image_url);
      this.updateTilePreview('img_url', image_url);
    });
  }

  onFileChanged(image) {
    const validate = this.fileService.validImage(image);

    if (validate.valid) {
      this.uploadImage(image);
    }
  }

  ngOnInit(): void {
    this.populateTilePreview();
    this.uploadImageBtn = this.cpI18n.translate('button_add_photo');

    this.form.valueChanges.subscribe(() => {
      this.updateTilePreview('name', this.form.controls['name'].value);
      this.changed.emit(this.form);
    });
  }
}
