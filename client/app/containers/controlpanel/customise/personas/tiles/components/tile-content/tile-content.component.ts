import { Component, Input, OnInit } from '@angular/core';
import { ITile } from './../../../persona.interface';

@Component({
  selector: 'cp-personas-tile-content',
  templateUrl: './tile-content.component.html',
  styleUrls: ['./tile-content.component.scss']
})
export class PersonasTileContentComponent implements OnInit {
  @Input() tile: ITile;
  @Input() visible: boolean;

  constructor() {}

  ngOnInit(): void {}
}
