import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IPersona } from '../../../../persona.interface';
import { CPI18nService } from '@campus-cloud/shared/services';
import { TilesUtilsService } from '../../../tiles.utils.service';
import { STUDIO_THIRD_PARTY } from '@campus-cloud/shared/constants';
import { PersonasUtilsService } from '../../../../personas.utils.service';
import { ContentUtilsProviders } from '@campus-cloud/libs/studio/providers';

@Component({
  selector: 'cp-personas-resource-list-form',
  templateUrl: './resource-list-form.component.html',
  styleUrls: ['./resource-list-form.component.scss']
})
export class PersonasResourceListFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() isEdit: boolean;
  @Input() persona: IPersona;

  @Output() valueChanges: EventEmitter<FormGroup> = new EventEmitter();

  defaultImg;
  filterByWeb = false;
  tileImageRequirements;
  filterByLogin = false;
  featureFlagThirdParty = STUDIO_THIRD_PARTY;
  contentTypes = ContentUtilsProviders.contentTypes;
  selectedContent = ContentUtilsProviders.contentTypes.single;

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

  onTypeChange(selectedContentId) {
    this.selectedContent = selectedContentId;

    this.form.patchValue({
      link_type: 3,
      link_url: null,
      link_params: {}
    });

    this.valueChanges.emit(this.form);
  }

  onCampusLinkFormChange(newValues) {
    this.form.patchValue(newValues);
    this.valueChanges.emit(this.form);
  }

  updateState() {
    this.selectedContent = ContentUtilsProviders.getContentTypeByCampusLink(this.form.value);
  }

  ngOnInit() {
    this.filterByWeb = PersonasUtilsService.isWeb(this.persona.platform);
    this.filterByLogin = PersonasUtilsService.isLoginForbidden(this.persona.login_requirement);
    this.tileImageRequirements = this.cpI18n.translate('t_personas_tile_image_requirements');
    this.form.valueChanges.subscribe((_) => this.valueChanges.emit(this.form));
    this.defaultImg = this.form.get('img_url').value;

    if (this.isEdit) {
      this.updateState();
    }
  }
}
