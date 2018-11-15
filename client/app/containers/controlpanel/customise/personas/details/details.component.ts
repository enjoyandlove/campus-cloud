import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { map, switchMap, finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { flatten, get as _get } from 'lodash';
import { combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';

import { IPersona } from './../persona.interface';
import { ITile } from './../tiles/tile.interface';
import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base';
import { TilesService } from '../tiles/tiles.service';
import { PersonasService } from './../personas.service';
import { ICampusGuide } from './../sections/section.interface';
import { CampusGuideType } from './../sections/section.status';
import { SectionsService } from './../sections/sections.service';
import { CategoryDeleteErrors } from '../sections/section.status';
import { TilesUtilsService } from './../tiles/tiles.utils.service';
import { PersonasUtilsService } from './../personas.utils.service';
import { SectionUtilsService } from './../sections/section.utils.service';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';
import { PersonasType, PersonaValidationErrors } from './../personas.status';
import { baseActions, IHeader, ISnackbar } from './../../../../../store/base';
import { CPI18nService, CPTrackingService } from '../../../../../shared/services';
import { TileCategoryRank, TileFeatureRank, TileType } from './../tiles/tiles.status';

interface IState {
  working: boolean;
  featuredTiles: ICampusGuide;
  guides: Array<ICampusGuide>;
  showTileDeleteModal: boolean;
  showSectionDeleteModal: boolean;
}

@Component({
  selector: 'cp-personas-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class PersonasDetailsComponent extends BaseComponent implements OnDestroy, OnInit {
  loading;
  personaId;
  tileToDelete: ITile;
  isWebPersona = false;
  sectionToDelete: ICampusGuide;
  tileDeleteModalId = 'tileDeleteModal';
  sectionDeleteModalId = 'sectionDeleteModal';

  state: IState = {
    guides: [],
    working: false,
    featuredTiles: null,
    showTileDeleteModal: false,
    showSectionDeleteModal: false
  };

  constructor(
    public zone: NgZone,
    public router: Router,
    public session: CPSession,
    public route: ActivatedRoute,
    public cpI18n: CPI18nService,
    public service: PersonasService,
    public tileService: TilesService,
    public utils: PersonasUtilsService,
    public tileUtils: TilesUtilsService,
    public cpTracking: CPTrackingService,
    public sectionService: SectionsService,
    public store: Store<IHeader | ISnackbar>,
    public sectionUtils: SectionUtilsService
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));
    this.personaId = this.route.snapshot.params['personaId'];
  }

  get temporaryGuides() {
    return this.state.guides.filter((g) => g._temporary).length;
  }

  onAddSectionBefore(newGuide: ICampusGuide, guideId: number) {
    const nextGuide = (guide: ICampusGuide) => guide.id === guideId;
    const nextGuideIndex = this.state.guides.findIndex(nextGuide);

    this.setGuideDisabledStatus(true);

    this.state.guides.splice(nextGuideIndex, 0, newGuide);
    this.state.guides = this.state.guides.map(
      (guide, index) => (index > nextGuideIndex ? { ...guide, rank: guide.rank + 1 } : guide)
    );
  }

  onSetSectionName({ guideId, body }) {
    this.setGuideDisabledStatus(true);
    this.setLoadingStatus(true);
    this.service
      .updateSectionTileCategory(guideId, body)
      .pipe(
        finalize(() => {
          this.setGuideDisabledStatus(false);
          this.setLoadingStatus(false);
        })
      )
      .subscribe(
        (guide: ICampusGuide) => {
          this.state = {
            ...this.state,
            guides: this.state.guides.map((g) => {
              return g.id === guide.id
                ? {
                    ...g,
                    name: guide.name
                  }
                : g;
            })
          };
        },
        (err) => {
          this.errorHandler(err);
        }
      );
  }

  onRemoveSection(g: ICampusGuide) {
    this.setGuideDisabledStatus(false);
    const filteredGuides = this.state.guides.filter((guide) => guide.id !== g.id);

    this.state = {
      ...this.state,
      guides: filteredGuides
    };
  }

  setGuideDisabledStatus(status) {
    this.state = {
      ...this.state,
      guides: this.state.guides.map((g: ICampusGuide) => {
        return {
          ...g,
          _disabled: status
        };
      })
    };
  }

  setLoadingStatus(status) {
    this.store.dispatch(
      status
        ? {
            type: baseActions.SNACKBAR_SHOW,
            payload: {
              sticky: true,
              autoClose: false,
              class: 'info',
              body: this.cpI18n.translate('t_saving')
            }
          }
        : { type: baseActions.SNACKBAR_HIDE }
    );
  }

  nonFeaturedTileToFeatureSection(movingTile: ITile, newCategory: ICampusGuide) {
    const isFeatured = this.tileUtils.isFeatured(movingTile);

    return !isFeatured && newCategory._featuredTile;
  }

  featuredTileToNonFeatureSection(movingTile: ITile, newCategory: ICampusGuide) {
    const isFeatured = this.tileUtils.isFeatured(movingTile);

    return isFeatured && !newCategory._featuredTile;
  }

  handleSuccess() {
    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        sticky: true,
        autoClose: true,
        class: 'success',
        body: this.cpI18n.translate('t_changes_saved_ok')
      }
    });
  }

  displayWarning() {
    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        sticky: true,
        autoClose: true,
        class: 'info',
        body: `${this.cpI18n.translate('t_saving')}...`
      }
    });
  }

  doBulkUpdate(tileUpdates) {
    const search = new HttpParams().set('school_persona_id', this.personaId);

    const body = tileUpdates.tilesToUpdate.map((t) => {
      return {
        rank: t.rank,
        tile_id: t.id,
        school_id: t.school_id,
        featured_rank: t.featured_rank,
        tile_category_id: t.tile_category_id
      };
    });

    this.state = { ...this.state, working: true };
    this.displayWarning();

    this.tileService
      .bulkUpdateTiles(search, body)
      .toPromise()
      .then(() => this.fetch(() => this.handleSuccess()))
      .then(() => {
        this.trackMovedTile(tileUpdates.movingTile);
        this.zone.run(() => {
          this.state = { ...this.state, working: false };
        });
      })
      .catch((err) => {
        this.zone.run(() => {
          this.state = { ...this.state, working: false };
        });
        this.errorHandler(err);
      });
  }

  onDeleteTileFromSection(tile: ITile) {
    this.tileToDelete = tile;

    this.state = {
      ...this.state,
      showTileDeleteModal: true
    };

    setTimeout(
      () => {
        $(`#${this.tileDeleteModalId}`).modal();
      },

      1
    );
  }

  onTileDeleted(tile: ITile) {
    if (this.tileUtils.isFeatured(tile)) {
      this.state = {
        ...this.state,
        featuredTiles: {
          ...this.state.featuredTiles,
          tiles: this.state.featuredTiles.tiles.filter((t: ITile) => t.id !== tile.id)
        }
      };
    } else {
      this.state = {
        ...this.state,
        guides: this.state.guides.map((g: ICampusGuide) => {
          if (g.id === tile.tile_category_id) {
            g = {
              ...g,
              tiles: g.tiles.filter((t: ITile) => t.id !== tile.id)
            };
          }

          return g;
        })
      };
    }
  }

  onSectionDeleteTeardown() {
    this.sectionToDelete = null;

    this.state = {
      ...this.state,
      showSectionDeleteModal: false
    };

    $(`#${this.sectionDeleteModalId}`).modal('hide');
  }

  onDeleteSectionClick(section: ICampusGuide) {
    this.sectionToDelete = section;

    this.state = {
      ...this.state,
      showSectionDeleteModal: true
    };

    setTimeout(
      () => {
        $(`#${this.sectionDeleteModalId}`).modal();
      },

      1
    );
  }

  onTileDeleteTeardown() {
    this.state = {
      ...this.state,
      showTileDeleteModal: false
    };

    this.tileToDelete = null;

    $(`#${this.tileDeleteModalId}`).modal('hide');
  }

  updateTileBodyAfterDrop(guide: ICampusGuide, tile: ITile, newBody) {
    return {
      ...guide,
      tiles: guide.tiles.map((t: ITile) => {
        return t.id === tile.id
          ? {
              ...t,
              ...newBody
            }
          : t;
      })
    };
  }

  createNewCategory() {
    this.displayWarning();
    this.state = { ...this.state, working: true };

    const school_id = this.session.g.get('school').id;
    const { name, rank } = this.state.guides.filter((g: ICampusGuide) => g._temporary)[0];
    const body = { school_id, name, rank, tiles: [] };

    let updateCategories = [];
    this.state.guides
      .filter((guide: ICampusGuide) => guide.rank > rank)
      .forEach((guide: ICampusGuide) => {
        updateCategories = [
          ...updateCategories,
          this.service
            .updateSectionTileCategory(guide.id, {
              school_id: this.session.g.get('school').id,
              rank: guide.rank
            })
            .toPromise()
        ];
      });

    return Promise.all([
      this.sectionService.createSectionTileCategory(body).toPromise(),
      ...updateCategories
    ]);
  }

  async onTileMoved({ tile, section }) {
    const guideTiles = flatten(this.state.guides.map((g) => g.tiles));
    const allTiles = [...guideTiles, ...this.state.featuredTiles.tiles];
    const allGuides = [...this.state.guides, this.state.featuredTiles];

    const movingTile = allTiles.filter((t: ITile) => t.id === tile)[0];

    if (!movingTile) {
      this.fetch(() => this.errorHandler()).then(() => {
        this.zone.run(() => {
          this.state = { ...this.state, working: false };
        });
      });

      return;
    }

    let newCategory: ICampusGuide;

    if (section === CampusGuideType.featured) {
      newCategory = this.state.featuredTiles;
    } else if (section === CampusGuideType.temporary) {
      let _category;

      try {
        _category = (await this.createNewCategory())[0];
      } catch (error) {
        return this.zone.run(() => this.errorHandler(error));
      }

      newCategory = {
        ..._category,
        tiles: [movingTile]
      };
    } else {
      newCategory = allGuides.filter((g) => g.id === +section)[0];
    }

    const school_id = this.session.g.get('school').id;

    if (this.nonFeaturedTileToFeatureSection(movingTile, newCategory)) {
      const body = {
        ...movingTile,
        school_id,
        tile_category_id: 0,
        rank: TileCategoryRank.hidden
      };

      newCategory = this.updateTileBodyAfterDrop(newCategory, movingTile, body);

      const tilesToUpdate = this.sectionUtils.updateGuideTileRank(
        newCategory,
        school_id,
        'featured_rank'
      );
      this.doBulkUpdate({ tilesToUpdate, movingTile });
    } else if (this.featuredTileToNonFeatureSection(movingTile, newCategory)) {
      const body = {
        ...movingTile,
        school_id,
        featured_rank: TileFeatureRank.notFeatured,
        tile_category_id: newCategory.id
      };

      newCategory = this.updateTileBodyAfterDrop(newCategory, movingTile, body);

      const tilesToUpdate = this.sectionUtils.updateGuideTileRank(newCategory, school_id, 'rank');
      this.doBulkUpdate({ tilesToUpdate, movingTile });
    } else {
      const body = {
        ...movingTile,
        school_id,
        tile_category_id: newCategory.id,
        featured_rank: TileFeatureRank.notFeatured
      };

      newCategory = this.updateTileBodyAfterDrop(newCategory, movingTile, body);

      const tilesToUpdate = this.sectionUtils.updateGuideTileRank(newCategory, school_id, 'rank');

      this.doBulkUpdate({ tilesToUpdate, movingTile });
    }
  }

  onDeletedSection(section: ICampusGuide) {
    this.state = {
      ...this.state,
      guides: this.state.guides.filter((guide: ICampusGuide) => guide.id !== section.id)
    };

    if (this.sectionUtils.isTemporaryGuide(section)) {
      this.setGuideDisabledStatus(false);
    }
  }

  errorHandler(err = null) {
    let snackBarClass = 'danger';
    let body = _get(err, ['error', 'response'], this.cpI18n.translate('something_went_wrong'));

    if (body === CategoryDeleteErrors.NON_EMPTY_CATEGORY) {
      snackBarClass = 'warning';
      body = this.cpI18n.translate('t_personas_delete_guide_error_non_empty_category');
    }

    if (body === PersonaValidationErrors.customization_off) {
      snackBarClass = 'warning';
      body = this.cpI18n.translate('t_personas_edit_error_customization_off');
    }

    if (err && err.status === 404) {
      this.router.navigate(['/studio/experiences']);

      return;
    }

    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        sticky: true,
        autoClose: true,
        class: snackBarClass,
        body: body
      }
    });
  }

  rankSections() {
    this.state = {
      ...this.state,
      guides: this.state.guides.sort((a, b) => a.rank - b.rank)
    };
  }

  fakeSwap(movingGuide, movedGuide, position: 'up' | 'down') {
    this.state = {
      ...this.state,
      guides: this.state.guides.map((g: ICampusGuide) => {
        return g.id === movingGuide.id
          ? {
              ...g,
              rank: position === 'up' ? movedGuide.rank - 1 : movedGuide.rank + 1
            }
          : g;
      })
    };

    this.rankSections();

    this.state = {
      ...this.state,
      working: false
    };
  }

  moveUp(guide) {
    const previousSectionIndex = this.state.guides.findIndex((g) => g.id === guide.id);
    const previousSection = this.state.guides[previousSectionIndex - 1];

    const school_id = this.session.g.get('school').id;
    const [newRank, currentRank] = [previousSection.rank, guide.rank];

    const currentTileBody = {
      school_id,
      rank: newRank
    };
    const pushedTileBody = {
      school_id,
      rank: currentRank
    };

    if (this.sectionUtils.isTemporaryGuide(guide)) {
      this.fakeSwap(guide, previousSection, 'up');

      return;
    }

    const updateCurrentTile$ = this.service.updateSectionTileCategory(guide.id, currentTileBody);
    const updatePushedTile$ = this.service.updateSectionTileCategory(
      previousSection.id,
      pushedTileBody
    );

    const stream$ = updateCurrentTile$.pipe(switchMap(() => updatePushedTile$));

    stream$.subscribe(
      () => {
        this.state = { ...this.state, working: false };
        this.fetch();
      },
      () => this.errorHandler()
    );
  }

  moveDown(guide) {
    const nextSectionIndex = this.state.guides.findIndex((g) => g.id === guide.id);
    const nextSection = this.state.guides[nextSectionIndex + 1];

    const school_id = this.session.g.get('school').id;
    const [newRank, currentRank] = [nextSection.rank, guide.rank];
    const currentTileBody = {
      school_id,
      rank: newRank
    };
    const pushedTileBody = {
      school_id,
      rank: currentRank
    };

    if (this.sectionUtils.isTemporaryGuide(guide)) {
      this.fakeSwap(guide, nextSection, 'down');

      return;
    }

    const updateCurrentTile$ = this.service.updateSectionTileCategory(guide.id, currentTileBody);
    const updatePushedTile$ = this.service.updateSectionTileCategory(
      nextSection.id,
      pushedTileBody
    );

    const stream$ = updateCurrentTile$.pipe(switchMap(() => updatePushedTile$));

    stream$.subscribe(
      () => {
        this.state = { ...this.state, working: false };
        this.fetch();
      },
      () => this.errorHandler()
    );
  }

  onSwapSection(direction: string, guide: ICampusGuide) {
    this.state = {
      ...this.state,
      working: true
    };
    if (direction === 'up') {
      this.moveUp(guide);
    } else {
      this.moveDown(guide);
    }

    this.trackMovedSection(guide);
  }

  fetch(callback = null) {
    const schoolIdSearch = new HttpParams().append('school_id', this.session.g.get('school').id);

    const tilesSearch = schoolIdSearch.append('school_persona_id', this.personaId);

    const tilesByPersona$ = this.service.getTilesByPersona(tilesSearch);
    const tileCategories$ = this.service.getTilesCategories(schoolIdSearch);

    const persona$ = this.service.getPersonaById(this.personaId, schoolIdSearch);

    const request$ = persona$.pipe(
      switchMap((persona: IPersona) => {
        const key = CPI18nService.getLocale().startsWith('fr') ? 'fr' : 'en';
        this.isWebPersona = persona.platform === PersonasType.web;
        this.updateHeader(persona.localized_name_map[key]);

        return combineLatest([tilesByPersona$, tileCategories$]);
      })
    );

    const stream$ = request$.pipe(
      map(([tiles, categories]) => {
        tiles = tiles.filter((t: ITile) => t.type === TileType.abstract);

        if (this.isWebPersona) {
          tiles = tiles.filter((tile) => this.tileUtils.isTileSupportedByWebApp(tile));
        }

        return {
          featured: this.utils.getFeaturedTiles(tiles),
          guides: this.utils.groupTilesWithTileCategories(categories, tiles)
        };
      })
    );

    return super
      .fetchData(stream$)
      .then(({ data }) => {
        const filteredTiles = data.guides.filter((g: ICampusGuide) => g.tiles.length);

        const temporaryTile = [this.sectionUtils.temporaryGuide(9e4)];

        const guides = filteredTiles.length ? filteredTiles : temporaryTile;

        this.state = {
          ...this.state,
          guides,
          featuredTiles: {
            id: null,
            rank: 1,
            name: null,
            _featuredTile: true,
            tiles: [...data.featured]
          }
        };

        if (callback) {
          callback();
        }

        return this.state;
      })
      .catch((err: HttpErrorResponse) => this.errorHandler(err));
  }

  updateHeader(personName) {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: {
        heading: `[NOTRANSLATE]${personName}[NOTRANSLATE]`,
        subheading: null,
        em: null,
        crumbs: {
          url: 'experiences',
          label: 't_personas'
        },
        children: []
      }
    });
  }

  ngOnDestroy() {
    this.store.dispatch({ type: baseActions.SNACKBAR_HIDE });
  }

  trackTileVisibility(tile: ITile) {
    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.STUDIO_CHANGED_TILE_STATUS,
      this.utils.getTileAmplitudeProperties(tile)
    );
  }

  trackMovedTile(tile: ITile) {
    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.STUDIO_DRAG_DROP_TILE,
      this.utils.getTileAmplitudeProperties(tile)
    );
  }

  trackMovedSection(guide: ICampusGuide) {
    const tiles = guide.tiles.length ? amplitudeEvents.YES : amplitudeEvents.NO;

    const eventProperties = {
      tiles,
      section_id: guide.id,
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.STUDIO_MOVED_SECTION,
      eventProperties
    );
  }

  ngOnInit(): void {
    this.fetch();
  }
}
