import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-personas-section-add-tile-button',
  templateUrl: './section-add-tile-button.component.html',
  styleUrls: ['./section-add-tile-button.component.scss']
})
export class PersonasSectionAddTileButtonComponent implements OnInit {
  @Output() addTileClick: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
