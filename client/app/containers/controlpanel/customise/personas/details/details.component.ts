import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HEADER_UPDATE, IHeader } from './../../../../../reducers/header.reducer';
import { ISnackbar } from './../../../../../reducers/snackbar.reducer';
import { ICampusGuide, IPersona, ITile } from './../persona.interface';
import { PersonasService } from './../personas.service';
import { PersonasUtilsService } from './../personas.utils.service';
import { BaseComponent } from '../../../../../base';
import { CPSession } from '../../../../../session';
import { CPI18nService } from '../../../../../shared/services';

interface IState {
  working: boolean;
  featureTiles: Array<ITile>;
  categoryZero: Array<ITile>;
  guides: Array<ICampusGuide>;
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
    public store: Store<IHeader | ISnackbar>
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));
    this.personaId = this.route.snapshot.params['personaId'];
  }

  onAddSectionBefore(newGuide: ICampusGuide, guideId: number) {
    const nextGuide = (guide: ICampusGuide) => guide.id === guideId;
    const nextGuideIndex = this.state.guides.findIndex(nextGuide);

    this.state.guides.splice(nextGuideIndex, 0, newGuide);
  }

  onDeletedSection(sectionId: number) {
    this.state.guides = this.state.guides.filter((guide: ICampusGuide) => guide.id !== sectionId);
  }

  getSectionByIndex(index) {
    return this.state.guides[index];
  }

  errorHanlder() {}

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
    const personaSearch = new HttpParams().append('school_id', this.session.g.get('school').id);

    const tilesSearch = new HttpParams()
      .append('school_id', this.session.g.get('school').id)
      .append('school_persona_id', this.personaId);

    const tileCategoriesSearch = new HttpParams().append(
      'school_id',
      this.session.g.get('school').id
    );

    const tiles$ = this.service.getTilesByPersona(tilesSearch);
    const tileCategories$ = this.service.getTilesCategories(tileCategoriesSearch);

    const persona$ = this.service.getPersonaById(this.personaId, personaSearch);

    const request$ = persona$.pipe(
      switchMap((persona: IPersona) => {
        const key = CPI18nService.getLocale().startsWith('fr') ? 'fr' : 'en';

        this.updateHeader(persona.localized_name_map[key]);

        return combineLatest([tiles$, tileCategories$]);
      })
    );
    const groupTiles = (categories, tiles) =>
      this.utils.groupTilesWithTileCategories(categories, tiles);

    const stream$ = request$.pipe(map(([tiles, categories]) => groupTiles(categories, tiles)));

    super
      .fetchData(stream$)
      .then(({ data }) => {
        this.state = {
          ...this.state,
          guides: this.utils.filterTiles(data),
          featureTiles: this.utils.getFeaturedTiles(data),
          categoryZero: this.utils.getCategoryZeroTiles(data)
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
        children: []
      }
    });
  }

  ngOnInit(): void {
    this.fetch();
  }
}
