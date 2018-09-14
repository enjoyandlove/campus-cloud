import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cp-providers-attendees-action-box',
  templateUrl: './providers-attendees-action-box.component.html',
  styleUrls: ['./providers-attendees-action-box.component.scss']
})
export class ServicesProvidersAttendeesActionBoxComponent {

  @Input() provider;
  @Input() eventData;

  @Output() download: EventEmitter<null> = new EventEmitter();
  @Output() search: EventEmitter<null> = new EventEmitter();

  constructor() {}

  onDownload() {
    this.download.emit();
  }

  onSearch(query) {
    this.search.emit(query);
  }
}
