import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'cp-personas-section-tile-hover',
  templateUrl: './section-tile-hover.component.html',
  styleUrls: ['./section-tile-hover.component.scss']
})
export class PersonasSectionTileHoverComponent implements OnInit {
  @Input() visible;
  @Input() defaultTile: boolean;

  @Output() editClick: EventEmitter<null> = new EventEmitter();
  @Output() deleteClick: EventEmitter<null> = new EventEmitter();
  @Output() toggleVisibility: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
