import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base';
import { PersonasService } from './../personas.service';
import { CPI18nService } from '../../../../../shared/services';
import { ICampusGuide, IPersona } from './../persona.interface';
import { PersonasUtilsService } from './../personas.utils.service';
import { ISnackbar } from './../../../../../reducers/snackbar.reducer';
import { IHeader, HEADER_UPDATE } from './../../../../../reducers/header.reducer';

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
    public CPI18n: CPI18nService,
    public service: PersonasService,
    public utils: PersonasUtilsService,
    public store: Store<IHeader | ISnackbar>
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));
    this.personaId = this.route.snapshot.params['personaId'];
  }

  fetch() {
    const personaSearch = new URLSearchParams();
    personaSearch.append('school_id', this.session.g.get('school').id);

    const tilesSearch = new URLSearchParams();
    tilesSearch.append('school_id', this.session.g.get('school').id);
    tilesSearch.append('school_persona_id', this.personaId);

    const tileCategoriesSearch = new URLSearchParams();
    tileCategoriesSearch.append('school_id', this.session.g.get('school').id);

    const tiles$ = this.service.getTilesByPersona(tilesSearch);
    const tileCategories$ = this.service.getTilesCategories(tileCategoriesSearch);

    const persona$ = this.service.getPersonaById(this.personaId, personaSearch);

    const request$ = persona$.switchMap((persona: IPersona) => {
      const key = CPI18nService.getLocale().startsWith('fr') ? 'fr' : 'en';

      this.updateHeader(persona.localized_name_map[key]);

      return Observable.combineLatest([tiles$, tileCategories$]);
    });
    const groupTiles = (categories, tiles) =>
      this.utils.groupTilesWithTileCategories(categories, tiles);

    const stream$ = request$.map(([tiles, categories]) => groupTiles(categories, tiles));

    super
      .fetchData(stream$)
      .then(({ data }) => {
        this.guides = data;
        console.log(this.guides);
      })
      .catch(() => this.router.navigate(['/customize/personas']));
  }

  updateHeader(personName) {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        heading: `[NOTRANSLATE]${personName}[NOTRANSLATE]`,
        subheading: null,
        // crumbs: {
        //   url: 'personas',
        //   label: 'personas'
        // },
        em: null,
        children: []
      }
    });
  }

  ngOnInit(): void {
    this.fetch();
  }
}
