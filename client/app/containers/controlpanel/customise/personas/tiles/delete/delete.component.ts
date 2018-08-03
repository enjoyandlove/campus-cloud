import { CPSession } from './../../../../../../session/index';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITile } from './../tile.interface';
import { CPI18nService } from '../../../../../../shared/services';
import { TilesService } from '../tiles.service';

@Component({
  selector: 'cp-personas-tile-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class PersonasTileDeleteComponent implements OnInit {
  @Input() tile: ITile;

  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();
  @Output() error: EventEmitter<HttpErrorResponse> = new EventEmitter();

  buttonData;

  constructor(
    public session: CPSession,
    public service: TilesService,
    public cpI18n: CPI18nService
  ) {}

  onDelete() {
    const search = new HttpParams().set('school_id', this.session.g.get('school').id);

    this.service.deleteTile(this.tile.id, search).subscribe(
      () => {
        this.deleted.emit(this.tile.id);
        this.teardown.emit();
      },
      (err) => {
        this.error.emit(err);
        this.teardown.emit();
      }
    );
  }

  ngOnInit(): void {
    this.buttonData = {
      text: this.cpI18n.translate('delete'),
      class: 'danger'
    };
  }
}
