import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';
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
  @Input() addSection: boolean;
  @Input() guide: ICampusGuide;
  @Input() nextSection: ICampusGuide;
  @Input() previousSection: ICampusGuide;

  @Output() addTile: EventEmitter<null> = new EventEmitter();
  @Output() created: EventEmitter<ICampusGuide> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  state = {
    working: false
  };

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

  moveUp() {
    const school_id = this.session.g.get('school').id;
    const [newRank, currentRank] = [this.previousSection.rank, this.guide.rank];
    const currentTileBody = {
      school_id,
      rank: newRank
    };
    const pushedTileBody = {
      school_id,
      rank: currentRank
    };
    const updateCurrentTile$ = this.service.updateSectionTileCategory(
      this.guide.id,
      currentTileBody
    );
    const updatePushedTile$ = this.service.updateSectionTileCategory(
      this.previousSection.id,
      pushedTileBody
    );

    const stream$ = updateCurrentTile$.pipe(switchMap(() => updatePushedTile$));

    stream$.subscribe((res) => console.log(res), (err) => console.log(err));
  }

  moveDown() {
    const school_id = this.session.g.get('school').id;
    const [newRank, currentRank] = [this.nextSection.rank, this.guide.rank];
    const currentTileBody = {
      school_id,
      rank: newRank
    };
    const pushedTileBody = {
      school_id,
      rank: currentRank
    };
    const updateCurrentTile$ = this.service.updateSectionTileCategory(
      this.guide.id,
      currentTileBody
    );
    const updatePushedTile$ = this.service.updateSectionTileCategory(
      this.nextSection.id,
      pushedTileBody
    );

    const stream$ = updateCurrentTile$.pipe(switchMap(() => updatePushedTile$));

    stream$.subscribe((res) => console.log(res), (err) => console.log(err));
  }

  onMove(direction) {
    if (direction === 'up') {
      this.moveUp();
    } else {
      this.moveDown();
    }
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

  onNameChange({ name }) {
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

  ngOnInit(): void {}
}
