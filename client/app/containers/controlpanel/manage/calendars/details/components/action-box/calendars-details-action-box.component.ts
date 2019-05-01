import { OnInit, Output, Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-calendars-details-action-box',
  templateUrl: './calendars-details-action-box.component.html',
  styleUrls: ['./calendars-details-action-box.component.scss']
})
export class CalendarsDetailsActionBoxComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter();

  constructor() {}

  onSearch(query) {
    this.search.emit(query);
  }

  launchModal() {
    $('#calendarsItemsImport').modal();
  }

  ngOnInit() {}
}
