import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HEADER_UPDATE, IHeader } from './../../../../../reducers/header.reducer';
import { ISnackbar } from './../../../../../reducers/snackbar.reducer';
import { ICampusGuide, IPersona } from './../persona.interface';
import { PersonasService } from './../personas.service';
import { PersonasUtilsService } from './../personas.utils.service';
import { BaseComponent } from '../../../../../base';
import { CPSession } from '../../../../../session';
import { CPI18nService } from '../../../../../shared/services';

@Component({
  selector: 'cp-personas-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class PersonasDetailsComponent extends BaseComponent implements OnInit {
  guides: Array<ICampusGuide>;
  loading;
  personaId;

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

  onAddTileToGuideClick() {
    $('#tilesCreate').modal();
  }

  createCampusGuide() {}

  onAddSectionBefore(newGuide: ICampusGuide, guideId: number) {
    const nextGuide = (guide: ICampusGuide) => guide.id === guideId;
    const nextGuideIndex = this.guides.findIndex(nextGuide);

    this.guides.splice(nextGuideIndex, 0, newGuide);
  }

  onDeletedSection(sectionId: number) {
    this.guides = this.guides.filter((guide: ICampusGuide) => guide.id !== sectionId);
  }

  getSectionByIndex(index) {
    return this.guides[index];
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
        this.guides = data;
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
