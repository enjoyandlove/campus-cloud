import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { SNACKBAR_SHOW } from './../../../../../../reducers/snackbar.reducer';
import { ICampusGuide, ITile } from './../../persona.interface';
import { SectionsService } from './../sections.service';
import { ISnackbar } from '../../../../../../reducers/snackbar.reducer';
import { CPSession } from '../../../../../../session';
import { CPI18nService } from '../../../../../../shared/services';

@Component({
  selector: 'cp-personas-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class PersonasSectionComponent implements OnInit {
  @Input() last: boolean;
  @Input() first: boolean;
  @Input() personaId: number;
  @Input() addSection: boolean;
  @Input() guide: ICampusGuide;
  @Input() previousSection: ICampusGuide;

  @Output() swap: EventEmitter<any> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();
  @Output() created: EventEmitter<ICampusGuide> = new EventEmitter();

  state = {
    working: false
  };

  modalId;
  lastRank;

  constructor(
    public session: CPSession,
    public service: SectionsService,
    public store: Store<ISnackbar>,
    public cpI18n: CPI18nService
  ) {}

  onEditedTile(editedTile: ITile) {
    this.guide = {
      ...this.guide,
      tiles: this.guide.tiles.map((tile: ITile) => (tile.id === editedTile.id ? editedTile : tile))
    };
  }

  onCreateError() {
    this.store.dispatch({
      type: SNACKBAR_SHOW,
      payload: {
        class: 'danger',
        body: this.cpI18n.translate('something_went_wrong'),
        sticky: true
      }
    });
  }

  onTearDown() {
    $(`#${this.modalId}`).modal('hide');
  }

  launchCreateTile() {
    $(`#${this.modalId}`).modal();
  }

  onMove(direction) {
    this.swap.emit(direction);
  }

  setWorkingState(working) {
    this.state = {
      ...this.state,
      working
    };
  }

  errorHandler() {
    this.setWorkingState(false);

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

  onAddSection() {
    this.setWorkingState(true);

    const body = {
      rank: this.previousSection.rank + 1,
      school_id: this.session.g.get('school').id,
      name: this.cpI18n.translate('t_personas_create_section_default_name')
    };

    this.service.createSectionTileCategory(body).subscribe(
      (createdSection: ICampusGuide) => {
        this.setWorkingState(false);
        this.created.emit(createdSection);
      },
      () => this.errorHandler()
    );
  }

  onNameChange(name) {
    const body = {
      name,
      school_id: this.session.g.get('school').id
    };

    this.setWorkingState(true);

    this.service.updateSectionTileCategory(this.guide.id, body).subscribe(
      (guide: ICampusGuide) => {
        this.guide = {
          ...this.guide,
          name: guide.name
        };

        this.setWorkingState(false);
      },
      () => this.errorHandler()
    );
  }

  onDeleteSection() {
    this.setWorkingState(true);
    const search = new HttpParams().set('school_id', this.session.g.get('school').id);

    this.service.deleteSectionTileCategory(this.guide.id, search).subscribe(
      () => {
        this.deleted.emit(this.guide.id);
        this.setWorkingState(false);
      },
      () => this.errorHandler()
    );
  }

  onDeletedTile(tileId: number) {
    this.guide = {
      ...this.guide,
      tiles: this.guide.tiles.filter((tile: ITile) => tile.id !== tileId)
    };
  }

  getLastRankInGuide() {
    const ranks = this.guide.tiles.map((tile) => tile.rank).sort();

    this.lastRank = ranks.length ? ranks[ranks.length - 1] : 1;
  }

  ngOnInit(): void {
    this.modalId = `createTileForGuide${this.guide.id}`;
    this.getLastRankInGuide();
  }
}
