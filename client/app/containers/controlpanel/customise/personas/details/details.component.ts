import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HEADER_UPDATE, IHeader } from './../../../../../reducers/header.reducer';
import { ISnackbar } from './../../../../../reducers/snackbar.reducer';
import { IPersona } from './../persona.interface';
import { PersonasService } from './../personas.service';
import { PersonasUtilsService } from './../personas.utils.service';
import { ICampusGuide } from './../sections/section.interface';
import { SectionUtilsService } from './../sections/section.utils.service';
import { BaseComponent } from '../../../../../base';
import { CPSession } from '../../../../../session';
import { CPI18nService } from '../../../../../shared/services';

interface IState {
  working: boolean;
  guides: Array<ICampusGuide>;
  featureTiles: Array<ICampusGuide>;
  categoryZero: Array<ICampusGuide>;
}

@Component({
  selector: 'cp-personas-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class PersonasDetailsComponent extends BaseComponent implements OnInit {
  loading;
  personaId;

  state: IState = {
    working: false,
    guides: [],
    featureTiles: [],
    categoryZero: []
  };

  constructor(
    public router: Router,
    public session: CPSession,
    public route: ActivatedRoute,
    public cpI18n: CPI18nService,
    public service: PersonasService,
    public utils: PersonasUtilsService,
    public sectionUtils: SectionUtilsService,
    public store: Store<IHeader | ISnackbar>
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));
    this.personaId = this.route.snapshot.params['personaId'];
  }

  onAddSectionBefore(newGuide: ICampusGuide, guideId: number) {
    const nextGuide = (guide: ICampusGuide) => guide.id === guideId;
    const nextGuideIndex = this.state.guides.findIndex(nextGuide);

    this.setGuideDisableStatus(true);

    this.state.guides.splice(nextGuideIndex, 0, newGuide);
  }

  onRemoveSection(guideId) {
    this.state = {
      ...this.state,
      guides: this.state.guides.filter((guide) => guide.id !== guideId)
    };
  }

  setGuideDisableStatus(status) {
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

  onDeletedSection(section: ICampusGuide) {
    this.state.guides = this.state.guides.filter((guide: ICampusGuide) => guide.id !== section.id);

    if (this.sectionUtils.isTemporaryGuide(section)) {
      this.setGuideDisableStatus(false);
    }
  }

  errorHanlder() {}

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
      () => this.errorHanlder()
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
      () => this.errorHanlder()
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
    const tileCategories$ = this.service.getTilesCategories(schoolIdSearch);
    const tilesByPersonaZero$ = this.service.getTilesByPersona(schoolIdSearch);
    const persona$ = this.service.getPersonaById(this.personaId, schoolIdSearch);

    const request$ = persona$.pipe(
      switchMap((persona: IPersona) => {
        const key = CPI18nService.getLocale().startsWith('fr') ? 'fr' : 'en';

        this.updateHeader(persona.localized_name_map[key]);

        return combineLatest([tilesByPersona$, tileCategories$, tilesByPersonaZero$]);
      })
    );

    const stream$ = request$.pipe(
      map(([tiles, categories, tilesByPersonaZero]) => {
        tiles = this.utils.mergeRelatedLinkData(tiles, tilesByPersonaZero);

        return {
          featured: this.utils.getFeatureTiles(tiles),
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

        this.state = {
          ...this.state,
          guides,
          featureTiles: [
            {
              id: null,
              rank: 1,
              name: null,
              _featureTile: true,
              tiles: [...data.featured]
            }
          ],
          categoryZero: [
            {
              id: null,
              rank: 1,
              name: null,
              _categoryZero: true,
              tiles: [...data.categoryZero]
            }
          ]
        };
      })
      .catch(() => this.router.navigate(['/customize/personas']));
  }

  updateHeader(personName) {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        heading: `[NOTRANSLATE]${personName}[NOTRANSLATE]`,
        subheading: null,
        em: null,
        crumbs: {
          url: 'personas',
          label: 't_personas'
        },
        children: []
      }
    });
  }

  ngOnInit(): void {
    this.fetch();
  }
}
