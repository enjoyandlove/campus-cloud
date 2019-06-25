import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { ITile } from '../tile.interface';
import { TilesService } from '../tiles.service';
import { CPSession } from '@campus-cloud/session';
import { BaseComponent } from '@campus-cloud/base';
import { IPersona } from './../../persona.interface';
import { PersonasService } from '../../personas.service';
import { TilesUtilsService } from '../tiles.utils.service';
import { ICampusGuide } from '../../sections/section.interface';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { SectionsService } from '../../sections/sections.service';
import { PersonasUtilsService } from './../../personas.utils.service';
import { baseActions, IHeader, ISnackbar } from '@campus-cloud/store/base';
import { SectionUtilsService } from '../../sections/section.utils.service';
import { ContentUtilsProviders } from '@campus-cloud/libs/studio/providers';
import { CPTrackingService, CPI18nService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-personas-tile-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class PersonasTileCreateComponent extends BaseComponent implements OnInit, OnDestroy {
  loading;
  persona: IPersona;
  personaId: number;
  guide: ICampusGuide;
  filterByWeb = false;
  formHasErrors = false;
  filterByLogin = false;
  campusLinkForm: FormGroup;
  disableSubmitButton = false;
  campusGuideTileForm: FormGroup;
  contentTypes = ContentUtilsProviders.contentTypes;

  canceledTileEventProperties = {
    tile_type: amplitudeEvents.NORMAL,
    added_content: amplitudeEvents.NO,
    added_resource: amplitudeEvents.NO,
    uploaded_image: amplitudeEvents.NO
  };

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: TilesService,
    public route: ActivatedRoute,
    public utils: TilesUtilsService,
    public guideService: SectionsService,
    public cpTracking: CPTrackingService,
    public guideUtils: SectionUtilsService,
    public personaService: PersonasService,
    public store: Store<IHeader | ISnackbar>,
    public sectionUtils: SectionUtilsService,
    public personasUtils: PersonasUtilsService
  ) {
    super();
    this.personaId = this.route.snapshot.params['personaId'];
    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  createGuideLink(newCategoryId = null) {
    let cloneGuideTileForm = {
      ...this.campusGuideTileForm.value
    };

    if (newCategoryId) {
      cloneGuideTileForm = {
        ...cloneGuideTileForm,
        tile_category_id: newCategoryId
      };
    }

    const createLink$ = this.service.createCampusLink(this.campusLinkForm.value);

    return createLink$.pipe(
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
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        sticky: true,
        class: 'danger',
        body: this.cpI18n.translate('something_went_wrong')
      }
    });
  }

  onSubmit() {
    this.formHasErrors = false;
    if (this.campusGuideTileForm.invalid || this.campusLinkForm.invalid) {
      this.formHasErrors = true;
      return;
    }
    this.disableSubmitButton = true;
    let stream$ = this.createGuideLink();
    const emptySection = this.guideUtils.isTemporaryGuide(this.guide);

    if (emptySection && !this.guide._featuredTile) {
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

    return stream$.subscribe(
      (tile: ITile) => {
        this.trackCreatedTile(tile);
        this.disableSubmitButton = false;
        this.setCanceledTileProperties();
        this.router.navigate(['/studio/experiences', this.personaId]);
      },
      (_) => {
        this.erroHandler();
        this.setCanceledTileProperties();
        this.disableSubmitButton = false;
      }
    );
  }

  doReset() {
    this.campusLinkForm.reset();
    this.campusGuideTileForm.reset();
  }

  buildForm() {
    this.campusLinkForm = this.utils.campusLinkForm(false, false);
    this.campusGuideTileForm = this.utils.campusGuideTileForm(this.personaId, this.guide);
  }

  buildHeader(personaName: string) {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: {
        heading: 't_personas_tile_create_header',
        subheading: null,
        em: null,
        crumbs: {
          url: `experiences/${this.personaId}`,
          label: `[NOTRANSLATE]${personaName}[NOTRANSLATE]`
        },
        children: []
      }
    });
  }

  onCampusGuideTileFormChange() {
    const name = this.campusGuideTileForm.controls['name'].value;
    const img_url = this.campusGuideTileForm.controls['img_url'].value;

    this.campusLinkForm.controls['name'].setValue(name);
    this.campusLinkForm.controls['img_url'].setValue(img_url);
    this.setCanceledTileProperties();
  }

  onCampusLinkFormChange(newValues) {
    this.campusLinkForm.patchValue(newValues);
    this.setCanceledTileProperties();
  }

  onTypeChange() {
    this.campusLinkForm.patchValue({
      link_type: 3,
      link_url: null,
      link_params: {}
    });

    this.setCanceledTileProperties();
  }

  onChangedContent(resourceType: number) {
    const added_content = resourceType ? amplitudeEvents.YES : amplitudeEvents.NO;

    this.canceledTileEventProperties = {
      ...this.canceledTileEventProperties,
      added_content
    };
  }

  ngOnDestroy() {
    this.guideService.guide = null;
    this.store.dispatch({ type: baseActions.SNACKBAR_HIDE });
  }

  fetch() {
    const search = new HttpParams().set('school_id', this.session.g.get('school').id);

    const personas$ = this.personaService.getPersonaById(this.personaId, search);

    super
      .fetchData(personas$)
      .then(({ data }: any) => {
        this.buildForm();
        this.persona = data;
        this.filterByWeb = PersonasUtilsService.isWeb(this.persona.platform);
        this.filterByLogin = PersonasUtilsService.isLoginForbidden(this.persona.login_requirement);
        this.buildHeader(PersonasUtilsService.localizedPersonaName(data));
      })
      .catch(() => this.erroHandler());
  }

  trackCreatedTile(tile: ITile) {
    const eventProperties = {
      ...this.personasUtils.getTileAmplitudeProperties(tile)
    };

    delete eventProperties.status;

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.STUDIO_CREATED_TILE, eventProperties);
  }

  trackCanceledTile() {
    const tile_type = this.guide._featuredTile ? amplitudeEvents.FEATURED : amplitudeEvents.NORMAL;

    this.canceledTileEventProperties = {
      ...this.canceledTileEventProperties,
      tile_type
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.STUDIO_CANCELED_TILE,
      this.canceledTileEventProperties
    );
  }

  setCanceledTileProperties() {
    const linkForm = this.campusLinkForm.value;
    const uploaded_image = linkForm.img_url ? amplitudeEvents.YES : amplitudeEvents.NO;
    const added_resource = linkForm.link_url ? amplitudeEvents.YES : amplitudeEvents.NO;

    this.canceledTileEventProperties = {
      ...this.canceledTileEventProperties,
      added_resource,
      uploaded_image
    };
  }

  ngOnInit(): void {
    this.guide = this.guideService.guide;

    if (!this.guide) {
      this.router.navigate(['/studio/experiences/', this.personaId]);

      return;
    }

    this.fetch();
  }
}