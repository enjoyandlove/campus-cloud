import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { flatten, get as _get } from 'lodash';
import { combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { isProd } from './../../../../../config/env/index';
import { HEADER_UPDATE, IHeader } from './../../../../../reducers/header.reducer';
import {
  ISnackbar,
  SNACKBAR_HIDE,
  SNACKBAR_SHOW
} from './../../../../../reducers/snackbar.reducer';
import { IPersona } from './../persona.interface';
import { PersonasService } from './../personas.service';
import { PersonasType, PersonaValidationErrors } from './../personas.status';
import { PersonasUtilsService } from './../personas.utils.service';
import { ICampusGuide } from './../sections/section.interface';
import { SectionUtilsService } from './../sections/section.utils.service';
import { ITile } from './../tiles/tile.interface';
import { TileCategoryRank, TileFeatureRank, TileType } from './../tiles/tiles.status';
import { TilesUtilsService } from './../tiles/tiles.utils.service';
import { BaseComponent } from '../../../../../base';
import { CPSession } from '../../../../../session';
import { CPI18nService } from '../../../../../shared/services';
import { CategoryDeleteErrors } from '../sections/section.status';
import { TilesService } from '../tiles/tiles.service';

interface IState {
  working: boolean;
  featureTiles: ICampusGuide;
  categoryZero: ICampusGuide;
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
  guideNames;
  tileToDelete: ITile;
  isWebPersona = false;
  sectionToDelete: ICampusGuide;
  tileDeleteModalId = 'tileDeleteModal';
  sectionDeleteModalId = 'sectionDeleteModal';

  state: IState = {
    working: false,
    guides: [],
    featureTiles: null,
    categoryZero: null,
    showTileDeleteModal: false,
    showSectionDeleteModal: false
  };

  constructor(
    public router: Router,
    public session: CPSession,
    public route: ActivatedRoute,
    public cpI18n: CPI18nService,
    public service: PersonasService,
    public tileService: TilesService,
    public utils: PersonasUtilsService,
    public tileUtils: TilesUtilsService,
    public store: Store<IHeader | ISnackbar>,
    public sectionUtils: SectionUtilsService
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));
    this.personaId = this.route.snapshot.params['personaId'];
  }

  onAddSectionBefore(newGuide: ICampusGuide, guideId: number) {
    const nextGuide = (guide: ICampusGuide) => guide.id === guideId;
    const nextGuideIndex = this.state.guides.findIndex(nextGuide);

    this.setGuideDisabledStatus(true);

    this.state.guides.splice(nextGuideIndex, 0, newGuide);
  }

  onRemoveSection(g: ICampusGuide) {
    this.setGuideDisabledStatus(false);

    this.state = {
      ...this.state,
      guides: this.state.guides.filter((guide) => guide.id !== g.id)
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

  nonFeaturedTileToFeatureSection(movingTile: ITile, newCategory: ICampusGuide) {
    const isFeatured = this.tileUtils.isFeatured(movingTile);

    return !isFeatured && newCategory._featureTile;
  }

  featuredTileToNonFeatureSection(movingTile: ITile, newCategory: ICampusGuide) {
    const isFeatured = this.tileUtils.isFeatured(movingTile);

    return isFeatured && !newCategory._featureTile;
  }

  nonCategoryZeroTileToCategoryZeroSection(movingTile: ITile, newCategory: ICampusGuide) {
    const isCategoryZero = this.tileUtils.isCategoryZero(movingTile);

    return !isCategoryZero && newCategory._categoryZero;
  }

  categoryZeroTileToNonCategoryZeroSection(movingTile: ITile, newCategory: ICampusGuide) {
    const isCategoryZero = this.tileUtils.isCategoryZero(movingTile);

    return isCategoryZero && !newCategory._categoryZero;
  }

  handleSuccess() {
    this.store.dispatch({
      type: SNACKBAR_SHOW,
      payload: {
        sticky: true,
        autoClose: true,
        class: 'success',
        body: this.cpI18n.translate('t_changes_saved_ok')
      }
    });
  }

  doBulkUpdate(tileUpdates) {
    const search = new HttpParams().set('school_persona_id', this.personaId);

    const body = tileUpdates.map((t) => {
      return {
        rank: t.rank,
        tile_id: t.id,
        school_id: t.school_id,
        featured_rank: t.featured_rank,
        tile_category_id: t.tile_category_id
      };
    });

    this.tileService
      .bulkUpdateTiles(search, body)
      .subscribe(() => this.handleSuccess(), (err) => this.errorHandler(err));
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
    if (this.tileUtils.isCategoryZero(tile)) {
      this.state = {
        ...this.state,
        categoryZero: {
          ...this.state.categoryZero,
          tiles: this.state.categoryZero.tiles.filter((t: ITile) => t.id !== tile.id)
        }
      };
    } else if (this.tileUtils.isFeatured(tile)) {
      this.state = {
        ...this.state,
        featureTiles: {
          ...this.state.featureTiles,
          tiles: this.state.featureTiles.tiles.filter((t: ITile) => t.id !== tile.id)
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

  onTileMoved({ tile, section }) {
    const guideTiles = flatten(this.state.guides.map((g) => g.tiles));
    const allTiles = [
      ...guideTiles,
      ...this.state.featureTiles.tiles,
      ...this.state.categoryZero.tiles
    ];
    const allGuides = [...this.state.guides, this.state.categoryZero, this.state.featureTiles];

    const movingTile = allTiles.filter((t: ITile) => t.id === tile)[0];
    const featureOrCategoryZero = (s) =>
      s === 'featured' ? this.state.featureTiles : this.state.categoryZero;

    let newCategory: ICampusGuide = isNaN(section)
      ? featureOrCategoryZero(section)
      : allGuides.filter((g) => g.id === +section)[0];

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
      this.doBulkUpdate(tilesToUpdate);
    } else if (this.featuredTileToNonFeatureSection(movingTile, newCategory)) {
      const body = {
        ...movingTile,
        school_id,
        featured_rank: TileFeatureRank.notFeatured,
        tile_category_id: newCategory._categoryZero ? 0 : newCategory.id
      };

      newCategory = this.updateTileBodyAfterDrop(newCategory, movingTile, body);

      const tilesToUpdate = this.sectionUtils.updateGuideTileRank(newCategory, school_id, 'rank');
      this.doBulkUpdate(tilesToUpdate);
    } else if (this.nonCategoryZeroTileToCategoryZeroSection(movingTile, newCategory)) {
      const body = {
        ...movingTile,
        school_id,
        tile_category_id: 0,
        featured_rank: TileFeatureRank.notFeatured
      };

      newCategory = this.updateTileBodyAfterDrop(newCategory, movingTile, body);

      const tilesToUpdate = this.sectionUtils.updateGuideTileRank(newCategory, school_id, 'rank');
      this.doBulkUpdate(tilesToUpdate);
    } else if (this.categoryZeroTileToNonCategoryZeroSection(movingTile, newCategory)) {
      const body = {
        ...movingTile,
        school_id,
        tile_category_id: newCategory.id,
        featured_rank: TileFeatureRank.notFeatured
      };

      newCategory = this.updateTileBodyAfterDrop(newCategory, movingTile, body);

      const tilesToUpdate = this.sectionUtils.updateGuideTileRank(newCategory, school_id, 'rank');
      this.doBulkUpdate(tilesToUpdate);
    } else {
      const body = {
        ...movingTile,
        school_id,
        tile_category_id: newCategory.id,
        featured_rank: TileFeatureRank.notFeatured
      };

      newCategory = this.updateTileBodyAfterDrop(newCategory, movingTile, body);

      const tilesToUpdate = this.sectionUtils.updateGuideTileRank(newCategory, school_id, 'rank');

      this.doBulkUpdate(tilesToUpdate);
    }
  }

  onDeletedSection(section: ICampusGuide) {
    this.state.guides = this.state.guides.filter((guide: ICampusGuide) => guide.id !== section.id);

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

    if (err.status === 404) {
      this.router.navigate(['/studio/experiences']);

      return;
    }

    this.store.dispatch({
      type: SNACKBAR_SHOW,
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
  }

  fetch() {
    const schoolIdSearch = new HttpParams().append('school_id', this.session.g.get('school').id);

    const tilesSearch = schoolIdSearch.append('school_persona_id', this.personaId);

    const tilesByPersona$ = this.service.getTilesByPersona(tilesSearch);
    const tileCategories$ = this.service
      .getTilesCategories(schoolIdSearch)
      .pipe(map((categories) => categories.filter((c) => c.id !== 0)));

    const tilesByPersonaZero$ = this.service.getTilesByPersona(schoolIdSearch);
    const persona$ = this.service.getPersonaById(this.personaId, schoolIdSearch);

    const request$ = persona$.pipe(
      switchMap((persona: IPersona) => {
        const key = CPI18nService.getLocale().startsWith('fr') ? 'fr' : 'en';
        this.isWebPersona = persona.platform === PersonasType.web;
        this.updateHeader(persona.localized_name_map[key]);

        return combineLatest([tilesByPersona$, tileCategories$, tilesByPersonaZero$]);
      })
    );

    const stream$ = request$.pipe(
      map(([tiles, categories, tilesByPersonaZero]) => {
        tiles = isProd
          ? this.utils.mergeRelatedLinkData(tiles, tilesByPersonaZero)
          : tiles.filter((t: ITile) => t.type === TileType.abstract);

        if (this.isWebPersona) {
          tiles = tiles.filter((tile) => this.tileUtils.isTileSupportedByWebApp(tile));
        }

        return {
          featured: this.utils.getFeaturedTiles(tiles),
          categoryZero: this.utils.getCategoryZeroTiles(tiles),
          guides: this.utils.groupTilesWithTileCategories(categories, tiles)
        };
      })
    );

    super
      .fetchData(stream$)
      .then(({ data }) => {
        const filteredTiles = data.guides.filter((g: ICampusGuide) => g.tiles.length);

        const temporaryTile = [this.sectionUtils.temporaryGuide(100)];

        const guides = filteredTiles.length ? filteredTiles : temporaryTile;

        this.guideNames = ['featured', 'category_zero', ...guides.map((g: ICampusGuide) => g.name)];

        this.state = {
          ...this.state,
          guides,
          featureTiles: {
            id: null,
            rank: 1,
            name: null,
            _featureTile: true,
            tiles: [...data.featured]
          },
          categoryZero: {
            id: null,
            rank: 1,
            name: null,
            _categoryZero: true,
            tiles: [...data.categoryZero]
          }
        };
      })
      .catch((err: HttpErrorResponse) => this.errorHandler(err));
  }

  updateHeader(personName) {
    this.store.dispatch({
      type: HEADER_UPDATE,
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
    this.store.dispatch({ type: SNACKBAR_HIDE });
  }

  ngOnInit(): void {
    this.fetch();
  }
}
