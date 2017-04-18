import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cp-lists-list-action-box',
  templateUrl: './lists-list-action-box.component.html',
  styleUrls: ['./lists-list-action-box.component.scss']
})
export class ListsListActionBoxComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() launchModal: EventEmitter<null> = new EventEmitter();

  constructor() { }

  ngOnInit() { }
}
