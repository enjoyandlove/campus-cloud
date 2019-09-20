import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { IPersona } from '../../../../persona.interface';
import { TilesUtilsService } from '../../../tiles.utils.service';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { PersonasUtilsService } from '../../../../personas.utils.service';
import { ContentUtilsProviders } from '@campus-cloud/libs/studio/providers';
import { TileImageValidatorService } from './tiles.image.validator.service';
import { CPI18nService, ImageService, ImageValidatorService } from '@campus-cloud/shared/services';

@Mixin([Destroyable])
@Component({
  selector: 'cp-personas-resource-list-form',
  templateUrl: './resource-list-form.component.html',
  styleUrls: ['./resource-list-form.component.scss'],
  providers: [
    ImageService,
    TileImageValidatorService,
    { provide: ImageValidatorService, useExisting: TileImageValidatorService }
  ]
})
export class PersonasResourceListFormComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;
  @Input() isEdit: boolean;
  @Input() persona: IPersona;
  @Input() showErrors = false;

  @Output() valueChanges: EventEmitter<FormGroup> = new EventEmitter();

  defaultImg;
  filterByWeb = false;
  tileImageRequirements;
  filterByLogin = false;
  contentTypes = ContentUtilsProviders.contentTypes;
  selectedContent = ContentUtilsProviders.contentTypes.single;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(public cpI18n: CPI18nService, public tileUtils: TilesUtilsService) {}

  onUploadedImage(image) {
    this.form.controls['img_url'].setValue(image);
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
    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.valueChanges.emit(this.form));
    this.defaultImg = this.form.get('img_url').value;
    if (this.isEdit) {
      this.updateState();
    }
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
