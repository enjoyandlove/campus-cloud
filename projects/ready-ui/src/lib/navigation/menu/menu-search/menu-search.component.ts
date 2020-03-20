import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'ready-ui-menu-search',
  templateUrl: './menu-search.component.html',
  styleUrls: ['./menu-search.component.scss']
})
export class MenuSearchComponent implements OnInit {
  @Output()
  search: EventEmitter<string> = new EventEmitter();

  @Input()
  placeholder = '';

  constructor() {}

  ngOnInit() {}
}
