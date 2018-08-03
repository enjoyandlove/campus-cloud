// import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { CPSession } from './../../../../../../session/index';
import { ITile } from './../tile.interface';
import { TilesService } from './../tiles.service';
import { TileVisibility } from './../tiles.status';
import { ISnackbar, SNACKBAR_SHOW } from '../../../../../../reducers/snackbar.reducer';
import { CPI18nService } from '../../../../../../shared/services';
import { TilesUtilsService } from '../tiles.utils.service';

@Component({
  selector: 'cp-personas-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class PersonasTileComponent implements OnInit {
  @Input() tile: ITile;

  @Output() edit: EventEmitter<ITile> = new EventEmitter();
  @Output() edited: EventEmitter<ITile> = new EventEmitter();
  @Output() deleteClick: EventEmitter<ITile> = new EventEmitter();

  state = {
    working: false,
    hover: false
  };

  constructor(
    public session: CPSession,
    public service: TilesService,
    public cpI18n: CPI18nService,
    public store: Store<ISnackbar>,
    public utils: TilesUtilsService
  ) {}

  toggleHover(hover) {
    this.state = {
      ...this.state,
      hover
    };
  }

  errorHandler() {
    this.state = {
      ...this.state,
      working: false
    };

    this.store.dispatch({
      type: SNACKBAR_SHOW,
      payload: {
        body: this.cpI18n.translate('something_went_wrong'),
        class: 'danger',
        sticky: true,
        autoClose: true
      }
    });
  }

  onDeleteTile() {
    this.state = {
      ...this.state
    };
  }

  onToggleTile() {
    this.state = {
      ...this.state,
      working: true
    };

    const visibility_status =
      this.tile.visibility_status === TileVisibility.invisible
        ? TileVisibility.visible
        : TileVisibility.invisible;

    const body = {
      visibility_status,
      school_id: this.session.g.get('school').id
    };

    this.service.updateTile(this.tile.id, body).subscribe(
      (editedTile: ITile) => {
        this.state = {
          ...this.state,
          working: false
        };

        this.edited.emit(editedTile);
      },
      () => this.errorHandler()
    );
  }

  ngOnInit(): void {}
}
