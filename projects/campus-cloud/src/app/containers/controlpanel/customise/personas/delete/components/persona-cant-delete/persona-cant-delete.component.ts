import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cp-persona-cant-delete',
  templateUrl: './persona-cant-delete.component.html',
  styleUrls: ['./persona-cant-delete.component.scss']
})
export class PersonaCantDeleteComponent {
  @Output() okClick: EventEmitter<null> = new EventEmitter();

  constructor() {}
}
