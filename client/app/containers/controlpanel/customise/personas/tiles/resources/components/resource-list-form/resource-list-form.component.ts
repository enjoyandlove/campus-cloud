import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IPersona } from '../../../../persona.interface';
import { TilesUtilsService } from '../../../tiles.utils.service';
import { ILink } from '../../../../../../manage/links/link.interface';
import { CPI18nService } from '../../../../../../../../shared/services';

@Component({
  selector: 'cp-personas-resource-list-form',
  templateUrl: './resource-list-form.component.html',
  styleUrls: ['./resource-list-form.component.scss']
})
export class PersonasResourceListFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() persona: IPersona;
  @Input() resource: ILink;

  @Output() valueChanges: EventEmitter<FormGroup> = new EventEmitter();

  defaultImg;
  tileImageRequirements;

  constructor(public cpI18n: CPI18nService, public tileUtils: TilesUtilsService) {}

  onUploadedImage(image) {
    this.form.controls['img_url'].setValue(image);
  }

  validateTileImage(file) {
    return new Promise((resolve, reject) => {
      this.tileUtils
        .validateTileImage(file)
        .then(() => resolve({ valid: true, errors: [] }))
        .catch((err) => reject({ valid: false, errors: [err] }));
    });
  }

  ngOnInit() {
    this.tileImageRequirements = this.cpI18n.translate('t_personas_tile_image_requirements');
    this.form.valueChanges.subscribe((_) => this.valueChanges.emit(this.form));
    this.defaultImg = this.form.get('img_url').value;
  }
}
