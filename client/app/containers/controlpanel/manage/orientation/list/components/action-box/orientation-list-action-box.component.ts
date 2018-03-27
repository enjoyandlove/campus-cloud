import { OnInit, Output, Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-orientation-list-action-box',
  templateUrl: './orientation-list-action-box.component.html',
  styleUrls: ['./orientation-list-action-box.component.scss']
})
export class OrientationListActionBoxComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() launchCreateModal: EventEmitter<null> = new EventEmitter();

  constructor() {}

  onSearch(query) {
    this.search.emit(query);
  }

  onLaunchCreateModal() {
    this.launchCreateModal.emit();
  }

  ngOnInit() {}
}
