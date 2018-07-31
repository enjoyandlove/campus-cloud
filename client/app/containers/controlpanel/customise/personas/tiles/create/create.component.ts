import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';
import { SNACKBAR_HIDE } from './../../../../../../reducers/snackbar.reducer';
import { BaseComponent } from '../../../../../../base';
import { HEADER_UPDATE, IHeader } from '../../../../../../reducers/header.reducer';
import { ISnackbar, SNACKBAR_SHOW } from '../../../../../../reducers/snackbar.reducer';
import { CPSession } from '../../../../../../session';
import { CPI18nService } from '../../../../../../shared/services/i18n.service';
import { PersonasService } from '../../personas.service';
import { ICampusGuide } from '../../sections/section.interface';
import { SectionUtilsService } from '../../sections/section.utils.service';
import { SectionsService } from '../../sections/sections.service';
import { TilesService } from '../tiles.service';
import { TilesUtilsService } from '../tiles.utils.service';

@Component({
  selector: 'cp-personas-tile-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class PersonasTileCreateComponent extends BaseComponent implements OnInit, OnDestroy {
  loading;
  buttonData;
  personaId: number;
  guide: ICampusGuide;
  campusLinkForm: FormGroup;
  campusGuideTileForm: FormGroup;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: TilesService,
    public route: ActivatedRoute,
    public utils: TilesUtilsService,
    public guideService: SectionsService,
    public guideUtils: SectionUtilsService,
    public personaService: PersonasService,
    public store: Store<IHeader | ISnackbar>,
    public sectionUtils: SectionUtilsService
  ) {
    super();
    this.personaId = this.route.snapshot.params['personaId'];
    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  createGuideLink(newCategoryId = null) {
    let cloneGuideTileForm = {
      ...this.campusGuideTileForm.value
    };

    let guideTilePersonaZero = {
      ...this.campusGuideTileForm.value,
      school_persona_id: 0
    };

    if (newCategoryId) {
      cloneGuideTileForm = {
        ...cloneGuideTileForm,
        tile_category_id: newCategoryId
      };

      guideTilePersonaZero = {
        ...guideTilePersonaZero,
        tile_category_id: newCategoryId
      };
    }

    // if (this.isFeatured) {
    //   cloneGuideTileForm = {
    //     ...cloneGuideTileForm,
    //     rank: -1,
    //     featured_rank: 0,
    //     tile_category_id: 0
    //   };

    //   guideTilePersonaZero = {
    //     ...guideTilePersonaZero,
    //     rank: -1,
    //     featured_rank: 0,
    //     tile_category_id: 0
    //   };
    // }

    // if (this.isCategoryZero) {
    //   cloneGuideTileForm = {
    //     ...cloneGuideTileForm,
    //     rank: -1,
    //     featured_rank: -1,
    //     tile_category_id: 0
    //   };

    //   guideTilePersonaZero = {
    //     ...guideTilePersonaZero,
    //     rank: -1,
    //     featured_rank: -1,
    //     tile_category_id: 0
    //   };
    // }

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

  erroHandler() {
    this.store.dispatch({
      type: SNACKBAR_SHOW,
      payload: {
        sticky: true,
        class: 'danger',
        body: this.cpI18n.translate('something_went_wrong')
      }
    });
  }

  onSubmit() {
    let stream$ = this.createGuideLink();
    const emptySection = this.guideUtils.isTemporaryGuide(this.guide);

    if (emptySection && !this.guide.categoryZero && !this.guide.featureTile) {
      const body = {
        ...this.guide,
        school_id: this.session.g.get('school').id
      };

      delete body['id'];

      const createTileCategory = this.guideService.createSectionTileCategory(body);
      stream$ = createTileCategory.pipe(
        switchMap((newCategory: ICampusGuide) => this.createGuideLink(newCategory.id))
      );
    }

    stream$.subscribe(
      () => {
        this.buttonData = {
          ...this.buttonData,
          disabled: false
        };

        this.router.navigate(['/customize/personas', this.personaId]);
      },
      (_) => {
        this.buttonData = {
          ...this.buttonData,
          disabled: false
        };
        this.erroHandler();
      }
    );
  }

  doReset() {
    this.campusLinkForm.reset();
    this.campusGuideTileForm.reset();
  }

  buildForm() {
    // const isTemporaryTile = this.sectionUtils.isTemporaryGuide(this.guide);
    // const lastRank = isTemporaryTile
    //   ? 1
    //   : sortBy(this.guide.tiles, (t: ITile) => -t.rank)[0].rank + 100;
    this.campusLinkForm = this.utils.campusLinkForm(false, false);
    this.campusGuideTileForm = this.utils.campusGuideTileForm(this.personaId, this.guide);
    console.log(this.campusGuideTileForm.value);
  }

  buildHeader(personaName: string) {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        heading: 't_personas_tile_create_header',
        subheading: null,
        em: null,
        crumbs: {
          url: `personas/${this.personaId}`,
          label: `[NOTRANSLATE]${personaName}[NOTRANSLATE]`
        },
        children: []
      }
    });
  }

  updateSubmitState() {
    this.buttonData = {
      ...this.buttonData,
      disabled: !(this.campusGuideTileForm.valid && this.campusLinkForm.valid)
    };
  }

  onCampusGuideTileFormChange() {
    this.updateSubmitState();

    const name = this.campusGuideTileForm.controls['name'].value;
    const img_url = this.campusGuideTileForm.controls['img_url'].value;

    this.campusLinkForm.controls['name'].setValue(name);
    this.campusLinkForm.controls['img_url'].setValue(img_url);
  }

  onCampusLinkFormChange() {
    this.updateSubmitState();
  }

  ngOnDestroy() {
    this.guideService.guide = null;
    this.store.dispatch({ type: SNACKBAR_HIDE });
  }

  getPersona() {
    const search = new HttpParams().set('school_id', this.session.g.get('school').id);

    this.personaService.getPersonaById(this.personaId, search);
  }

  fetch() {
    const search = new HttpParams().set('school_id', this.session.g.get('school').id);

    const personas$ = this.personaService.getPersonaById(this.personaId, search);

    super
      .fetchData(personas$)
      .then(({ data }: any) => {
        this.buildForm();
        this.buildHeader(this.utils.getPersonaNameByLocale(data));
      })
      .catch(() => this.erroHandler());
  }

  ngOnInit(): void {
    this.guide = this.guideService.guide;

    if (!this.guide) {
      this.router.navigate(['/customize/personas/', this.personaId]);

      return;
    }

    this.buttonData = {
      class: 'primary',
      disabled: true,
      text: this.cpI18n.translate('t_personas_create_submit_button')
    };

    this.fetch();
  }
}
