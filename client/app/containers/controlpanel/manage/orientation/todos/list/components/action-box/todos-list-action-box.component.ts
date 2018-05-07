import { OnInit, Output, Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-todos-list-action-box',
  templateUrl: './todos-list-action-box.component.html',
  styleUrls: ['./todos-list-action-box.component.scss']
})
export class TodosListActionBoxComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() launchCreateModal: EventEmitter<null> = new EventEmitter();

  constructor() { }

  onSearch(query) {
    this.search.emit(query);
  }

  onLaunchCreateModal() {
    this.launchCreateModal.emit();
  }

  ngOnInit() { }
}
