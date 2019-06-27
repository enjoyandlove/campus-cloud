import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-categories-action-box',
  templateUrl: './categories-action-box.component.html',
  styleUrls: ['./categories-action-box.component.scss']
})
export class CategoriesActionBoxComponent {
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() launchCreateModal: EventEmitter<null> = new EventEmitter();
}
