import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ITile } from './../../../../../persona.interface';

@Component({
  selector: 'cp-personas-section-tile',
  templateUrl: './section-tile.component.html',
  styleUrls: ['./section-tile.component.scss']
})
export class PersonasSectionTileComponent implements OnInit {
  @Input() tile: ITile;

  @Output() editClick: EventEmitter<null> = new EventEmitter();
  @Output() hideClick: EventEmitter<null> = new EventEmitter();
  @Output() deleteClick: EventEmitter<null> = new EventEmitter();

  hover = false;

  constructor() {}

  ngOnInit(): void {}
}
