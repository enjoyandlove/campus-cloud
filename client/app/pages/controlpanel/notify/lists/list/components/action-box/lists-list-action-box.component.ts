import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cp-lists-list-action-box',
  templateUrl: './lists-list-action-box.component.html',
  styleUrls: ['./lists-list-action-box.component.scss']
})
export class ListsListActionBoxComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter();

  constructor() { }

  launchModal() {
    console.log('should launch modal');
  }

  onLaunchCreateModal() {
    console.log('onLaunchCreateModal');
  }

  ngOnInit() { }
}
