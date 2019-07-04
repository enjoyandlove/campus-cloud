import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-no-testers',
  templateUrl: './no-testers.component.html',
  styleUrls: ['./no-testers.component.scss']
})
export class NoTestersComponent implements OnInit {
  @Output() create: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
