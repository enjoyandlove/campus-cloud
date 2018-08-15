import { TilesUtilsService } from './../../tiles.utils.service';
import { SNACKBAR_SHOW } from './../../../../../../../reducers/snackbar.reducer';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';
import { ISnackbar } from '../../../../../../../reducers/snackbar.reducer';
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

  constructor(
    public cpI18n: CPI18nService,
    public store: Store<ISnackbar>,
    public utils: TilesUtilsService,
    public fileService: FileUploadService
  ) {}

  onColorChange(hexColor: string) {
    const colorStr = hexColor.replace('#', '');
    this.form.controls['color'].setValue(colorStr);
  }

  uploadImage(image) {
    this.fileService.uploadFile(image).subscribe(({ image_url }: any) => {
      this.form.controls['img_url'].setValue(image_url);
    });
  }

  onFileChanged(file) {
    const validateTileImage = this.utils.validateTileImage(file);

    validateTileImage.then(() => this.uploadImage(file)).catch((body) => {
      this.store.dispatch({
        type: SNACKBAR_SHOW,
        payload: {
          autoClose: true,
          class: 'warning',
          body
        }
      });
    });
  }

  ngOnInit(): void {
    this.uploadImageBtn = this.cpI18n.translate('button_add_photo');

    this.form.valueChanges.subscribe(() => {
      this.formChange.emit(this.form);
    });
  }
}
