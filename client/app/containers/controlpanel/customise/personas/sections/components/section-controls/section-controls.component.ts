import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'cp-personas-section-controls',
  templateUrl: './section-controls.component.html',
  styleUrls: ['./section-controls.component.scss']
})
export class PersonasSectionControlsComponent implements OnInit {
  @Input() disabled: boolean;
  @Input() disableUp: boolean;
  @Input() disableDown: boolean;

  @Output() moveUp: EventEmitter<null> = new EventEmitter();
  @Output() moveDown: EventEmitter<null> = new EventEmitter();
  @Output() editClick: EventEmitter<null> = new EventEmitter();
  @Output() deleteClick: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
