import { TilesService } from './../tiles.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CPSession } from './../../../../../../session';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';
import { IPersona } from '../../persona.interface';
import { TilesUtilsService } from '../tiles.utils.service';

@Component({
  selector: 'cp-personas-tile-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class PersonasTileCreateComponent implements OnInit {
  @Input() persona: IPersona;
  @Input() personaId: number;
  @Input() categoryId: number;

  buttonData;
  _lastRank: number;
  campusLinkForm: FormGroup;
  campusGuideTileForm: FormGroup;

  state = {
    campusLinkFormValid: false,
    campusGuideTileFormValid: false
  };

  @Input()
  set lastRank(lastRank) {
    this._lastRank = lastRank + 100;
  }

  constructor(
    public cpI18n: CPI18nService,
    public fb: FormBuilder,
    public session: CPSession,
    public utils: TilesUtilsService,
    public service: TilesService
  ) {}

  onSubmit() {
    // const createLink$ = this.service.createCampusLink(this.campusLinkForm.value);
    // const createTile$ = this.service.createCampusTile(this.campusGuideTileForm.value);

    // createLink$.pipe(switchMapTo(createTile$))
    console.log(this.campusLinkForm.value);
    console.log(this.campusGuideTileForm.value);

    this.buttonData = {
      ...this.buttonData,
      disabled: false
    };
  }

  onCategoryChange({ id }): void {
    this.campusLinkForm.controls['tile_category_id'].setValue(id);
  }

  buildForm() {
    this.campusLinkForm = this.utils.campusLinkForm();
    this.campusGuideTileForm = this.utils.campusGuideTileForm(
      this.personaId,
      this._lastRank,
      this.categoryId
    );
  }

  onCampusLinkFormChange(linkForm: FormGroup) {
    this.state = {
      ...this.state,
      campusLinkFormValid: linkForm.valid
    };

    this.checkSubmitButtonStatus();
  }

  checkSubmitButtonStatus() {
    this.buttonData = {
      ...this.buttonData,
      disabled: !this.state.campusGuideTileFormValid && !this.state.campusLinkFormValid
    };
  }

  updateSharedValues(tileForm: FormGroup) {
    const img_url = tileForm.get('img_url').value;
    const name = tileForm.get('name').value;

    this.campusLinkForm.controls['img_url'].setValue(img_url);
    this.campusLinkForm.controls['name'].setValue(name);
  }

  onCampusGuideTileFormChange(tileForm: FormGroup) {
    this.state = {
      ...this.state,
      campusGuideTileFormValid: tileForm.valid
    };

    this.updateSharedValues(tileForm);
    this.checkSubmitButtonStatus();
  }

  ngOnInit(): void {
    this.buildForm();

    this.buttonData = {
      class: 'primary',
      disabled: true,
      text: this.cpI18n.translate('t_personas_create_submit_button')
    };
  }
}
