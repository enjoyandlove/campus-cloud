import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CPSession } from './../../../../../../session';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';
import { TileVisibility, TileFeatureRank } from './../tiles.status';
import { IPersona } from '../../persona.interface';
import { Component, OnInit, Input } from '@angular/core';

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
  form: FormGroup;
  _lastRank: number;

  @Input()
  set lastRank(lastRank) {
    this._lastRank = lastRank + 100;
  }

  constructor(public cpI18n: CPI18nService, public fb: FormBuilder, public session: CPSession) {}

  onSubmit() {
    // console.log('YOOO');
  }

  onContentTypeChange() {
    // console.log('selected ', {id});
  }

  onCategoryChange({ id }): void {
    this.form.controls['tile_category_id'].setValue(id);
  }

  buildForm() {
    this.form = this.fb.group({
      school_id: [this.session.g.get('school').id, Validators.required],
      school_persona_id: [this.personaId, Validators.required],
      name: [null, Validators.required],
      rank: [this._lastRank, Validators.required],
      img_url: [null, Validators.required],
      color: [null, Validators.required],
      extra_info: [null, Validators.required],
      visibility_status: [TileVisibility.visible],
      tile_category_id: [this.categoryId, Validators.required],
      featured_rank: [TileFeatureRank.notFeatured, Validators.required]
    });
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
