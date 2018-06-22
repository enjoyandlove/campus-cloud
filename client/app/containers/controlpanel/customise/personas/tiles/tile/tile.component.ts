import { TileVisibility } from './../tiles.status';
import { CPSession } from './../../../../../../session/index';
import { TilesService } from './../tiles.service';
import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ITile } from './../../persona.interface';
import { TilesUtilsService } from '../tiles.utils.service';

@Component({
  selector: 'cp-personas-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class PersonasTileComponent implements OnInit {
  @Input() tile: ITile;

  hover = false;

  constructor(
    public utils: TilesUtilsService,
    public service: TilesService,
    public session: CPSession
  ) {}

  onEditTile() {}

  onDeleteTile() {
    console.log('deleting');
    const search = new HttpParams().set('school_id', this.session.g.get('school').id);

    this.service.deleteTile(this.tile.id, search);
  }

  onToggleTile() {
    console.log('toggling');
    const visibility_status =
      this.tile.visibility_status === TileVisibility.invisible
        ? TileVisibility.visible
        : TileVisibility.invisible;

    const body = {
      visibility_status,
      school_id: this.session.g.get('school').id
    };

    this.service.updateTile(this.tile.id, body);
  }

  ngOnInit(): void {}
}
