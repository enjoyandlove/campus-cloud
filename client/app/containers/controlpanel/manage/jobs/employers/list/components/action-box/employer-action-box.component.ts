import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cp-employer-action-box',
  templateUrl: './employer-action-box.component.html',
  styleUrls: ['./employer-action-box.component.scss']
})
export class EmployerActionBoxComponent {
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() launchCreateModal: EventEmitter<null> = new EventEmitter();

  constructor() {}

  onSearch(query) {
    this.search.emit(query);
  }

  onLaunchCreateModal() {
    this.launchCreateModal.emit();
  }
}
