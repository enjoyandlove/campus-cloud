import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-lists-delete',
  templateUrl: './lists-delete.component.html',
  styleUrls: ['./lists-delete.component.scss']
})
export class ListsDeleteComponent implements OnInit {
  @Input() list: any;
  @Output() deletedList: EventEmitter<number> = new EventEmitter();

  constructor() { }

  onDelete() {
    console.log('deleting');
  }

  ngOnInit() { }
}
