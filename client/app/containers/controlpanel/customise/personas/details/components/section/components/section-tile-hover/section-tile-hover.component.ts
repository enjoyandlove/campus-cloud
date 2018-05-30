import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-personas-section-tile-hover',
  templateUrl: './section-tile-hover.component.html',
  styleUrls: ['./section-tile-hover.component.scss']
})
export class PersonasSectionTileHoverComponent implements OnInit {
  @Output() editClick: EventEmitter<null> = new EventEmitter();
  @Output() hideClick: EventEmitter<null> = new EventEmitter();
  @Output() deleteClick: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
