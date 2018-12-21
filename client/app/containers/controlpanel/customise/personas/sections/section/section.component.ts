import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { get as _get } from 'lodash';
import { Store } from '@ngrx/store';

import * as Sortable from 'sortablejs';
import { ITile } from '../../tiles/tile.interface';
import { ICampusGuide } from '../section.interface';
import { SectionsService } from '../sections.service';
import { CPSession } from '../../../../../../session';
import { CampusGuideType } from './../section.status';
import { TilesService } from './../../tiles/tiles.service';
import { SectionUtilsService } from '../section.utils.service';
import { CPI18nService } from '../../../../../../shared/services';
import { TilesUtilsService } from './../../tiles/tiles.utils.service';
import { ISnackbar, baseActions } from '../../../../../../store/base';

interface ISetSectionName {
  guideId: number;
  body: {
    name: string;
    school_id: number;
  };
}

@Component({
  selector: 'cp-personas-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class PersonasSectionComponent implements OnInit {
  @Input() tileWidth = '3';
  @Input() noTitle = false;
  @Input() personaId: number;
  @Input() noControls = false;
  @Input() canMoveUp: boolean;
  @Input() canDelete: boolean;
  @Input() guide: ICampusGuide;
  @Input() noMarginTop: boolean;
  @Input() canMoveDown: boolean;
  @Input() showAddSection = true;
  @Input() disableAddSection = false;

  @Output() swap: EventEmitter<any> = new EventEmitter();
  @Output() tileVisibility: EventEmitter<ITile> = new EventEmitter();
  @Output() deleted: EventEmitter<ICampusGuide> = new EventEmitter();
  @Output() removeSection: EventEmitter<number> = new EventEmitter();
  @Output() deleteTileClick: EventEmitter<ITile> = new EventEmitter();
  @Output() moveWithinSection: EventEmitter<any> = new EventEmitter();
  @Output() createNewSection: EventEmitter<ICampusGuide> = new EventEmitter();
  @Output() setSectionName: EventEmitter<ISetSectionName> = new EventEmitter();
  @Output() deleteSectionClick: EventEmitter<ICampusGuide> = new EventEmitter();
  @Output()
  moveToSection: EventEmitter<{
    tile: number;
    section: number | string;
    position: number;
  }> = new EventEmitter();

  state = {
    working: false,
    sorting: false,
    deletingTile: false,
    disableDragging: false,
    tileDeleteModal: false,
    sectionDeleteModal: false
  };

  lastRank;
  sortableOptions;
  selectedTile: ITile;
  sectionId: number | string;

  constructor(
    public router: Router,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<ISnackbar>,
    public service: SectionsService,
    public tilesService: TilesService,
    public utils: SectionUtilsService,
    public tileUtils: TilesUtilsService
  ) {}

  onSavedGuide(newGuide) {
    this.guide = {
      ...this.guide,
      ...newGuide
    };
  }

  onEditedTile(editedTile: ITile) {
    this.guide = {
      ...this.guide,
      tiles: this.guide.tiles.map((tile: ITile) => (tile.id === editedTile.id ? editedTile : tile))
    };

    this.tileVisibility.emit(editedTile);
  }

  onEditTile(tile: ITile) {
    this.service.guide = this.guide;
    this.router.navigate([`/studio/experiences/${this.personaId}/tiles/${tile.id}/edit`]);
  }

  goToCreateTile() {
    this.service.guide = {
      ...this.guide,
      _featuredTile: this.guide._featuredTile
    };

    this.router.navigate([`/studio/experiences/${this.personaId}/tiles`]);
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

  errorHandler(err: HttpErrorResponse) {
    const snackBarClass = 'danger';
    const body = _get(err, ['error', 'response'], this.cpI18n.translate('something_went_wrong'));

    this.setWorkingState(false);

    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        body,
        sticky: true,
        autoClose: true,
        class: snackBarClass
      }
    });
  }

  onAddSection() {
    const previousRank = this.guide.rank - 1;
    const rank = previousRank === 0 ? 1 : previousRank;

    this.createNewSection.emit(this.utils.temporaryGuide(rank));
  }

  onNameChange(name) {
    const body = {
      name,
      school_id: this.session.g.get('school').id
    };

    this.setSectionName.emit({ guideId: this.guide.id, body });
  }

  onMoveToSection(event) {
    const position = event.newIndex;
    const tile = Number(event.item.dataset.tile);
    const section = event.target.dataset.section;

    if (section) {
      this.moveToSection.emit({ tile, section, position });
    }
  }

  onMoveWithinSection(event) {
    this.state = { ...this.state, sorting: true };
    const schoolId = this.session.g.get('school').id;
    const bulkContent = {
      ...this.guide,
      tiles: this.guide.tiles.map((t) => {
        const { id, rank, featured_rank, tile_category_id } = t;

        return {
          id,
          rank,
          featured_rank,
          tile_category_id,
          school_id: schoolId
        };
      })
    };

    const tileId = Number(event.item.dataset.tile);
    const guideRank = this.guide._featuredTile ? 'featured_rank' : 'rank';
    const tilesToUpdate = this.utils.updateGuideTileRank(bulkContent, schoolId, guideRank);
    const movingTile = this.guide.tiles.filter((tile: ITile) => tile.id === tileId)[0];

    this.moveWithinSection.emit({ tilesToUpdate, movingTile });
  }

  onMoveCheckDraggable(event) {
    const toLength = event.to.childElementCount - 1;
    const toIndex = Sortable.utils.index(event.related, '.tile');

    const toEnd = toIndex === toLength;
    const toRight = event.willInsertAfter;
    const inRange = toIndex < toLength;
    // if dragging to the end of section, do not left the tile go to the right of the add button

    return toEnd ? !toRight : inRange;
  }

  ngOnInit(): void {
    if (this.guide._featuredTile) {
      this.sectionId = CampusGuideType.featured;
    } else if (this.guide._temporary) {
      this.sectionId = CampusGuideType.temporary;
    } else {
      this.sectionId = this.guide.id;
    }

    this.sortableOptions = {
      scroll: false,
      filter: '.js_do_not_drag',
      group: {
        name: 'studio',
        // ability to move from the list
        put: true,

        // whether elements can be added from other lists
        pull: true
      },
      onAdd: this.onMoveToSection.bind(this),
      onUpdate: this.onMoveWithinSection.bind(this),
      onMove: this.onMoveCheckDraggable,
      swapThreshold: 0.8
    };
  }
}
