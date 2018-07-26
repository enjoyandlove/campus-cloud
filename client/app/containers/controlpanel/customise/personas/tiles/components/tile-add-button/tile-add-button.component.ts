import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-personas-tile-add-button',
  templateUrl: './tile-add-button.component.html',
  styleUrls: ['./tile-add-button.component.scss']
})
export class PersonasTileAddButtonComponent implements OnInit {
  @Output() buttonClick: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
