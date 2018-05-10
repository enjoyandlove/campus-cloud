import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cp-templates-top-bar',
  templateUrl: './templates-top-bar.component.html',
  styleUrls: ['./templates-top-bar.component.scss']
})
export class TemplatesTopBarComponent implements OnInit {
  @Output() create: EventEmitter<null> = new EventEmitter();
  @Output() query: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
