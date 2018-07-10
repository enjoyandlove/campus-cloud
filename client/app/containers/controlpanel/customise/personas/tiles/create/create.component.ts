import { SectionsService } from './../../sections/sections.service';
import { SectionUtilsService } from './../../sections/section.utils.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { CPSession } from './../../../../../../session';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';
import { ICampusGuide } from './../../sections/section.interface';
import { ITile } from './../tile.interface';
import { TilesService } from './../tiles.service';
import { TilesUtilsService } from '../tiles.utils.service';

@Component({
  selector: 'cp-personas-tile-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class PersonasTileCreateComponent implements OnInit {
  @Input() personaId: number;
  @Input() guide: ICampusGuide;

  @Output() error: EventEmitter<ITile> = new EventEmitter();
  @Output() created: EventEmitter<ITile> = new EventEmitter();
  @Output() teardown: EventEmitter<ITile> = new EventEmitter();
  @Output() createdGuide: EventEmitter<ICampusGuide> = new EventEmitter();

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
    this._lastRank = +lastRank + 100;
  }

  constructor(
    public cpI18n: CPI18nService,
    public fb: FormBuilder,
    public session: CPSession,
    public utils: TilesUtilsService,
    public service: TilesService,
    public guideService: SectionsService,
    public guideUtils: SectionUtilsService
  ) {}

  createGuideLink(tileCategoryId = this.guide.id) {
    const cloneGuideTileForm = {
      ...this.campusGuideTileForm.value,
      tile_category_id: tileCategoryId
    };

    const guideTilePersonaZero = {
      ...this.campusGuideTileForm.value,
      school_persona_id: 0,
      tile_category_id: tileCategoryId
    };

    const createLink$ = this.service.createCampusLink(this.campusLinkForm.value);

    return createLink$.pipe(
      switchMap(({ id }: any) => {
        const extra_info = { id };

        const data = {
          ...guideTilePersonaZero,
          extra_info
        };

        return this.service.createCampusTile(data);
      }),
      switchMap(({ id }: any) => {
        const extra_info = { id };

        const data = {
          ...cloneGuideTileForm,
          extra_info
        };

        return this.service.createCampusTile(data);
      })
    );
  }

  onSubmit() {
    let stream$ = this.createGuideLink();

    if (this.guideUtils.isTemporaryGuide(this.guide)) {
      const body = {
        ...this.guide,
        school_id: this.session.g.get('school').id
      };

      delete body['id'];

      const createTileCategory = this.guideService.createSectionTileCategory(body);
      stream$ = createTileCategory.pipe(
        switchMap((newCategory: ICampusGuide) => {
          this.createdGuide.emit(newCategory);

          return this.createGuideLink(newCategory.id);
        })
      );
    }

    stream$.subscribe(
      (newGuide: ITile) => {
        this.created.emit(newGuide);
        this.doReset();
      },
      (err) => {
        this.doReset();
        this.error.emit(err);
      }
    );
  }

  doReset() {
    this.teardown.emit();
    this.campusLinkForm.reset();
    this.campusGuideTileForm.reset();
  }

  buildForm() {
    this.campusLinkForm = this.utils.campusLinkForm();
    this.campusGuideTileForm = this.utils.campusGuideTileForm(
      this.personaId,
      this._lastRank,
      this.guide.id
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
    const img_url = tileForm.controls['img_url'].value;
    const name = tileForm.controls['name'].value;

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
