import { Component, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'cp-past-events-action-box',
  templateUrl: './past-events-action-box.component.html',
  styleUrls: ['./past-events-action-box.component.scss']
})
export class EventsPastActionBoxComponent {
  @Output() querySearch: EventEmitter<string> = new EventEmitter();
  @Output() createExcel: EventEmitter<null> = new EventEmitter();

  onSearch(query) { this.querySearch.emit(query); }

  downloadExcel() { this.createExcel.emit(); }
}
