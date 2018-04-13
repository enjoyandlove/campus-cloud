import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'cp-audience-list-action-box',
  templateUrl: './audience-list-action-box.component.html',
  styleUrls: ['./audience-list-action-box.component.scss']
})
export class AudienceListActionBoxComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() launchCreateModal: EventEmitter<null> = new EventEmitter();
  @Output() launchImportModal: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
