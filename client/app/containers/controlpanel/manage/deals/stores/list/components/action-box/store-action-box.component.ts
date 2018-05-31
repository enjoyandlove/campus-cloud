import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cp-store-action-box',
  templateUrl: './store-action-box.component.html',
  styleUrls: ['./store-action-box.component.scss']
})
export class StoreActionBoxComponent {
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
