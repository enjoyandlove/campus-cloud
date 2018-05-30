import { Component, OnInit, Input } from '@angular/core';

import { ITile } from './../../../../../persona.interface';

@Component({
  selector: 'cp-personas-section-tile',
  templateUrl: './section-tile.component.html',
  styleUrls: ['./section-tile.component.scss']
})
export class PersonasSectionTileComponent implements OnInit {
  @Input() tile: ITile;

  constructor() {}

  ngOnInit(): void {}
}
