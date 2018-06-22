import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-personas-section-add-button',
  templateUrl: './section-add-button.component.html',
  styleUrls: ['./section-add-button.component.scss']
})
export class PersonasSectionAddButtonComponent implements OnInit {
  @Output() addSection: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
