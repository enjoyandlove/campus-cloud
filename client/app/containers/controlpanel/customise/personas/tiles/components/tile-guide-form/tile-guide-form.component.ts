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
  @Input() uploadButtonId: number;

  @Output() formChange: EventEmitter<FormGroup> = new EventEmitter();

  uploadImageBtn;

  constructor(public cpI18n: CPI18nService, public fileService: FileUploadService) {}

  onColorChange(hexColor: string) {
    const colorStr = hexColor.replace('#', '');
    this.form.controls['color'].setValue(colorStr);
  }

  uploadImage(image) {
    this.fileService.uploadFile(image).subscribe(({ image_url }: any) => {
      this.form.controls['img_url'].setValue(image_url);
    });
  }

  onFileChanged(image) {
    const validate = this.fileService.validImage(image);

    if (validate.valid) {
      this.uploadImage(image);
    }
  }

  ngOnInit(): void {
    this.uploadImageBtn = this.cpI18n.translate('button_add_photo');

    this.form.valueChanges.subscribe(() => {
      this.formChange.emit(this.form);
    });
  }
}
