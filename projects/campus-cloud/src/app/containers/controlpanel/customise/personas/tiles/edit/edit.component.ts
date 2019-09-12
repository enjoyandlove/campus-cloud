import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { merge, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import { ITile } from '../tile.interface';
import { TilesService } from '../tiles.service';
import { CPSession } from '@campus-cloud/session';
import { BaseComponent } from '@campus-cloud/base';
import { IPersona } from '../../persona.interface';
import { PersonasService } from '../../personas.service';
import { TilesUtilsService } from '../tiles.utils.service';
import { ICampusGuide } from '../../sections/section.interface';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { SectionsService } from '../../sections/sections.service';
import { PersonasUtilsService } from '../../personas.utils.service';
import { ContentUtilsProviders } from '@campus-cloud/libs/studio/providers';
import { PersonasAmplitudeService } from '../../personas.amplitude.service';
import { CPTrackingService, CPI18nService } from '@campus-cloud/shared/services';
import { baseActionClass, baseActions, IHeader, ISnackbar } from '@campus-cloud/store/base';

@Component({
  selector: 'cp-personas-tile-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class PersonasTileEditComponent extends BaseComponent implements OnInit, OnDestroy {
  tileId;
  loading;
  editable;
  campusLinkId;
  tile: ITile;
  persona: IPersona;
  personaId: number;
  filterByWeb = false;
  guide: ICampusGuide;
  formHasErrors = false;
  filterByLogin = false;
  destroy$ = new Subject();
  campusLinkForm: FormGroup;
  disableSubmitButton = false;
  campusGuideTileForm: FormGroup;
  contentTypes = ContentUtilsProviders.contentTypes;
  selectedContent = ContentUtilsProviders.contentTypes.single;

  editedTileEventProperties = {
    tile_id: null,
    tile_status: null,
    section_type: null,
    content_type: null,
    tile_type: amplitudeEvents.NORMAL,
    uploaded_image: amplitudeEvents.NO,
    changed_content: amplitudeEvents.NO,
    changed_section: amplitudeEvents.NO
  };

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: TilesService,
    public route: ActivatedRoute,
    public utils: TilesUtilsService,
    public cpTracking: CPTrackingService,
    public guideService: SectionsService,
    public personaService: PersonasService,
    public store: Store<IHeader | ISnackbar>,
    public personaAmplitude: PersonasAmplitudeService
  ) {
    super();
    this.tileId = this.route.snapshot.params['tileId'];
    this.personaId = this.route.snapshot.params['personaId'];
    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  updateGuideTile(tileCategoryId = this.guide.id) {
    const cloneGuideTileForm = {
      ...this.campusGuideTileForm.value,
      tile_category_id: tileCategoryId
    };

    const updateLink$ = this.service.updateCampusLink(this.campusLinkId, this.campusLinkForm.value);

    return updateLink$.pipe(
      switchMap(({ id }: any) => {
        const extra_info = { id };

        const data = {
          ...cloneGuideTileForm,
          extra_info
        };

        return this.service.updateCampusTile(this.tileId, data);
      })
    );
  }

  onTypeChange(selectedContentId) {
    this.formHasErrors = false;
    this.selectedContent = selectedContentId;

    this.editedTileEventProperties = {
      ...this.editedTileEventProperties,
      changed_section: amplitudeEvents.YES
    };
  }

  handleError() {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: this.cpI18n.translate('something_went_wrong')
      })
    );
  }

  handleSuccess(key) {
    this.store.dispatch(
      new baseActionClass.SnackbarSuccess({
        body: this.cpI18n.translate(key)
      })
    );
  }

  onSubmit() {
    this.formHasErrors = false;

    if (this.campusGuideTileForm.invalid || this.campusLinkForm.invalid) {
      this.formHasErrors = true;
      return;
    }
    this.disableSubmitButton = true;

    const stream$ = this.updateGuideTile();

    stream$.subscribe(
      (res) => {
        this.disableSubmitButton = false;
        this.editedTileEventProperties = {
          ...this.editedTileEventProperties,
          ...this.personaAmplitude.getTileAmplitudeProperties(res)
        };

        this.cpTracking.amplitudeEmitEvent(
          amplitudeEvents.STUDIO_UPDATED_TILE,
          this.editedTileEventProperties
        );

        this.router
          .navigate(['/studio/experiences', this.personaId])
          .then(() => this.handleSuccess('t_persona_tile_saved_successfully'));
      },
      (_) => {
        this.handleError();
        this.disableSubmitButton = false;
      }
    );
  }

  doReset() {
    this.campusLinkForm.reset();
    this.campusGuideTileForm.reset();
  }

  buildForm() {
    const tileId = this.route.snapshot.params['tileId'];
    this.tile = this.guide.tiles.filter((i) => i.id === +tileId)[0];

    this.campusLinkForm = this.utils.campusLinkForm(false, false, this.tile.related_link_data);

    this.campusLinkId = this.tile.related_link_data.id;

    this.campusGuideTileForm = this.utils.campusGuideTileForm(
      this.personaId,
      this.guide,
      this.tile
    );

    this.editable = !this.utils.isCampaignTile(this.tile) && !this.utils.isDeprecated(this.tile);
    this.selectedContent = ContentUtilsProviders.getContentTypeByCampusLink(
      this.campusLinkForm.value
    );

    merge(this.campusLinkForm.valueChanges, this.campusGuideTileForm.valueChanges)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => (this.formHasErrors = false));
  }

  buildHeader(personaName: string) {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: {
        heading: 't_personas_tile_update_header',
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
  }

  onCampusLinkFormChange(newValues) {
    this.campusLinkForm.patchValue(newValues);

    this.editedTileEventProperties = {
      ...this.editedTileEventProperties,
      changed_content: amplitudeEvents.YES
    };
  }

  onChangedImage(isChanged: boolean) {
    const uploaded_image = isChanged ? amplitudeEvents.YES : amplitudeEvents.NO;

    this.editedTileEventProperties = {
      ...this.editedTileEventProperties,
      uploaded_image
    };
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.guideService.guide = null;
    this.store.dispatch({ type: baseActions.SNACKBAR_HIDE });
  }

  fetch() {
    const search = new HttpParams().set('school_id', this.session.g.get('school').id);

    const persona$ = this.personaService.getPersonaById(this.personaId, search);

    super
      .fetchData(persona$)
      .then(({ data }) => {
        this.buildForm();
        this.persona = data;
        this.filterByWeb = PersonasUtilsService.isWeb(this.persona.platform);
        this.filterByLogin = PersonasUtilsService.isLoginForbidden(this.persona.login_requirement);
        this.buildHeader(PersonasUtilsService.getLocalizedLabel(this.persona.localized_name_map));
      })
      .catch(() => this.handleError());
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
