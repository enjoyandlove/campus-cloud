import { Output, Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-data-export-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class DataExportTopBarComponent implements OnInit {
  @Output()
  search: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
