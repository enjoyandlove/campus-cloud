import { TileVisibility } from './../personas.status';
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

  onAddTileToGuideClick() {
    $('#tilesCreate').modal();
  }

  onDeleteTile(tile: ITile) {
    const search = new HttpParams().set('school_id', this.session.g.get('school').id);

    this.service.deleteTile(tile.id, search).subscribe(() => this.fetch());
  }

  updateCampusGuideTile(guide: ICampusGuide, updateTile: ITile) {
    return {
      ...guide,
      tiles: guide.tiles.map((tile: ITile) => (tile.id === updateTile.id ? updateTile : tile))
    };
  }

  onToggleTileVisibility(tile: ITile) {
    const visibility_status =
      tile.visibility_status === TileVisibility.invisible
        ? TileVisibility.visible
        : TileVisibility.invisible;

    const body = {
      visibility_status,
      school_id: this.session.g.get('school').id
    };

    this.service.updateTile(tile.id, body).subscribe(() => this.fetch());
  }

  onEditTile(tile: ITile) {
    console.log('editing', tile);
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
