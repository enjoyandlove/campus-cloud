import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'cp-lists-list-action-box',
  templateUrl: './lists-list-action-box.component.html',
  styleUrls: ['./lists-list-action-box.component.scss']
})
export class ListsListActionBoxComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() launchCreateModal: EventEmitter<null> = new EventEmitter();
  @Output() launchImportModal: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
