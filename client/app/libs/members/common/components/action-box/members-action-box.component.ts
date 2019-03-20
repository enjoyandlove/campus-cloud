import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-members-action-box',
  templateUrl: './members-action-box.component.html',
  styleUrls: ['./members-action-box.component.scss']
})
export class MembersActionBoxComponent implements OnInit {
  @Input() showCreateButton = true;
  @Input() showDownloadButton = true;

  @Output() create: EventEmitter<null> = new EventEmitter();
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() download: EventEmitter<null> = new EventEmitter();

  constructor() {}

  onSearch(query: string) {
    this.search.emit(query);
  }

  ngOnInit() {}
}
