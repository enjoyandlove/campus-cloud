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

  constructor(public utils: TilesUtilsService) {}

  ngOnInit(): void {}
}
